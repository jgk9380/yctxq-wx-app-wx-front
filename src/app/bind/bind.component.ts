import {Component, OnInit} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/forkJoin";
import {ToasterConfig, ToasterService} from "angular2-toaster";
import {ActivatedRoute} from "@angular/router";
import {WxCodeService} from "../wx-code.service";

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.css']
})

export class BindComponent implements OnInit {

  // baseUrl = "http://127.0.0.1";
  // url = "http://www.cu0515.com/wx/codeToOpenId/";
  wxUser: any;
  authCode: string;
  newTele: string;
  getAuthCodeButtonTitle: string = "获取验证码";
  getAuthCodeButtonDisable = false;

  toasterConfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      timeout: 5000,
      positionClass: "toast-center"
    });

  constructor(private  httpClient: HttpClient, private  toasterService: ToasterService,
              private activatedRoute: ActivatedRoute, private wxCodeService: WxCodeService) {

  }

  ngOnInit() {
    //todo 应该改造为service中返回observale
    // var x = this.httpClient.get(this.wxCodeService.getCodeToWxUserUrl() + this.wxCodeService.code).subscribe(data => {
    //     var tempResult: any = data;
    //     this.wxUser = tempResult.data;
    //     this.newTele = this.wxUser.tele;
    //     console.log("wxUser=" + JSON.stringify(this.wxUser));
    //   }
    // );
    this.wxCodeService.getWxUser().then(x => {
      this.wxUser = x;
      this.newTele = this.wxUser.tele
    })
  }


  getAuthCode() {
    // alert(this.getBStrLen(this.newTele));
    if (this.wxUser.tele == this.newTele) {
      this.toasterService.pop({type: 'error', title: 'error', body: "无须重新绑定", showCloseButton: true,});
      return;
    }

    if (!this.checkMobile(this.newTele)) {
      this.toasterService.pop({type: 'error', title: 'error', body: "请输入有效手机号码", showCloseButton: true,});
      return;
    }
    this.httpClient.get(this.wxCodeService.baseUrl + "/public/smsAuth/" + this.newTele).subscribe(data => {
      var temp: any = data;
      console.log(data);
      if (temp.errorCode == 0) {
        console.log("验证码发送成功，请查收！");
        this.toasterService.pop({
          type: 'success',
          title: "success",
          body: '验证码发送成功，请查收！',
          showCloseButton: true,
        });
        var restTime = 60;
        this.getAuthCodeButtonDisable = true;
        var interval = setInterval(() => {
          restTime = restTime - 1;
          this.getAuthCodeButtonTitle = "" + restTime + "s";
          if (restTime <= 0) {
            clearInterval(interval);
            this.getAuthCodeButtonTitle = "获取验证码";
            this.getAuthCodeButtonDisable = false;
          }
          //console.log("title="+this.getAuthCodeButtonTitle+"restTime="+restTime);
        }, 1000);
      } else {
        this.toasterService.pop({
          type: 'error',
          title: "error",
          body: "短信服务故障，请稍后在试！",
          showCloseButton: true,
        });
      }
    })
  }

  bindTele() {
    ///NoAuthService/bindTele/{wxUserId}/{tele}/{code}
    if (!this.authCode) {
      this.toasterService.pop({
        type: 'error',
        title: 'error',
        body: "请输入验证码",
        showCloseButton: true,
      });
      return;
    }

    var url = "/public/bindTele/" + this.wxUser.id + "/" + this.newTele + "/" + this.authCode;
    console.log("url=" + this.wxCodeService.baseUrl + url);
    this.httpClient.post(this.wxCodeService.baseUrl + url, {}).subscribe(data => {
      console.log("bind result=" + JSON.stringify(data));
      var result: any = data;
      if (result.code == 0) {
        console.log("号码绑定成功！");
        this.wxUser.tele = this.newTele;
        this.toasterService.pop({
          type: 'success',
          title: 'success',
          body: '号码绑定成功',
          showCloseButton: true,
        });
      }
    });
  }

  submitUserInfo() {
    var url = "/public/userAddressLName/" + this.wxUser.id + "/" + this.wxUser.longName + "/" + this.wxUser.mailAddr;
    this.httpClient.post(this.wxCodeService.baseUrl + url, {}).subscribe(data => {
      console.log("bind result=" + JSON.stringify(data));
      var result: any = data;
      if (result.code == 0) {
        console.log("资料修改成功！");
        this.toasterService.pop({
          type: 'success',
          title: "sucess",
          body: '资料修改成功',
          showCloseButton: true,
        });
        //this.wxUser.tele=this.newTele;
      }
    }, error => console.log(), () => {
    });
  }


  isTeleDisable(): boolean {
    var isChinaUnion = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6]|6[6])\d{8}$/;
    var bool = isChinaUnion.test(this.wxUser.tele);
    //console.log("bool=" + bool);
    return bool;
  }


  teleIsUnicom() {
    var isChinaUnion = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/;
    var bool = isChinaUnion.test(this.wxUser.tele);
    //console.log("bool=" + bool);
    return bool;
  }

  // getUrlParam(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  //   var r = window.location.search.substr(1).match(reg);
  //   if (r != null) return unescape(r[2]);
  //   return null;
  // }
  //
  // getQueryString(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  //   console.log("window.location=" + window.location)
  //   var r = window.location.substr(1).match(reg);
  //   console.log("r=" + r);
  //   if (r != null) return unescape(r[2]);
  //   return null;
  // }

  getRequestParams() {
    var url = "" + window.location; //获取url中"?"符后的字串
    var theRequest = new Object();
    console.log("url=" + url);
    console.log("url.indexOf(?)=" + url.indexOf("?"));
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1);
      console.log("str=" + str);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
    }
    console.log("theRequest=" + JSON.stringify(theRequest))
    return theRequest;
  }


  getBStrLen = function (str) {
    if (str == null) return 0;
    if (typeof str != "string") {
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "01").length;
  }

  checkMobile(tele) {
    if (this.getBStrLen(tele) != 11) return false;
    if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(tele))) {
      //alert("不是完整的11位手机号或者正确的手机号前七位");
      //document.mobileform.mobile.focus();
      return false;
    }
    return true;
  }
}
