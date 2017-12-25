import {Component, OnInit} from '@angular/core';
import {ScanService} from "../scan.service";

@Component({
  selector: 'app-user-developer',
  templateUrl: './user-developer.component.html',
  styleUrls: ['./user-developer.component.css']
})
export class UserDeveloperComponent implements OnInit {
  // window.location.href="https://m.10010.com/queen/tencent/new-fill.html?product=0&channel=110&mobile="+tele;
  tele:string;

  constructor(private  scanService:ScanService) {

  }

  ngOnInit() {

  }

  addBill() {
    if(!this.checkMobile(this.tele)){
      alert("请检查手机号码！");
      return;
    }

    this.scanService.addOrderTele(this.tele).then(x=>{
      console.log("订单成功："+JSON.stringify(x));
      window.location.href="https://m.10010.com/queen/tencent/new-fill.html?product=0&channel=110&mobile="+this.tele;
    });

  }


  checkMobile(tele:string) {
    //alert(tele.length);
    if (tele.length!=11) return false;

    if (!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(tele))) {
      //alert("不是完整的11位手机号或者正确的手机号前七位");
      //document.mobileform.mobile.focus();
      return false;
    }
    return true;
  }


  getBStrLen = function (str) {
    if (str == null) return 0;
    if (typeof str != "string") {
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "01").length;
  }
}
