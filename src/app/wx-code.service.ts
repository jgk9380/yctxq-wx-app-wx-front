import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResultCode} from "./result-code";
import "rxjs/add/operator/map"

@Injectable()
export class WxCodeService {
 baseUrl = "http://www.cu0515.com";
  // baseUrl = "http://127.0.0.1:8888";
  //appCommit中初始化
  private code: string;
  shareId: number;
  wxUser: any;
  sharer:any;
  jsTicketUrl: string;

  //private  wxUser:any;//todo app中初始化
  constructor(private  httpClient: HttpClient) {
  }

  setCode(code: string) {
    this.code = code
  };

  getWxUser(): Promise<any> {
    console.log("this.getCode()"+this.getCode())
    if (!this.getCode()) return Promise.resolve(null);
    let url=this.getCodeToWxUserUrl() + this.getCode();
    // console.log("---this.getCode()"+url);
    if(this.wxUser) return this.wxUser;
    return this.httpClient.get<ResultCode>(url).map(data => data.data)
      .toPromise()
      .then(x => {this.wxUser = x; return this.wxUser;})
      .catch(x=> alert("app error"+x));
  }

  getSharer(): Promise<any> {
    if(this.sharer) return this.sharer;
    if (!this.getShareId()||this.getShareId()==0) return Promise.resolve(null);
    let url=this.baseUrl + "/public/article/wxUserByShareId/" + this.getShareId();
    // console.log("--url="+url)
    return this.httpClient.get<ResultCode>(url).map(data => data.data)
      .toPromise().then(sharer=>this.sharer=sharer);
  }

  getShareId(): number {
    // if (!this.shareId)
    //   return 9007624;
    if (!this.shareId)
       return 0;
    return this.shareId;
  }

  getCode(): string {
    // if (!this.code)
    //   return "8346102";
    return this.code;
  }


  getRequestParams() {
    var url = "" + window.location; //获取url中"?"符后的字串
    var theRequest = new Object();
    console.log("url=" + url);
    // console.log("url.indexOf(?)=" + url.indexOf("?"));
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1);
      if (str.indexOf("#") != -1) {
        str = str.substring(0, str.indexOf("#"))  //截掉后部
      }
      console.log("str=   " + str);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        //theRequest[strs[i].split("=")[0]] = window.unescape(strs[i].split("=")[1]);
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
    }
    console.log("theRequest=" + JSON.stringify(theRequest))
    return theRequest;
  }


  getCodeToWxUserUrl() {
    // if (!this.getCode() || this.getCode().length == 7)
    //   return this.baseUrl + "/wx/codeToOpenIdTestTest/";
    // else
    return this.baseUrl + "/wx/codeToOpenId/";
  }
}
