import {ResultCode} from "../result-code";
import {WxCodeService} from "../wx-code.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/operator/map";
import {Agent} from "./agent-add/agent-add.component";

@Injectable()
export class ScanService {
  qrId: number;
  openId: string;

  constructor(private  httpClient: HttpClient, private  wxCodeService: WxCodeService) {

  }


  getQrInfo(qrId: number): Promise<ResultCode> {
    let url = this.wxCodeService.baseUrl + "/public/wxQrCodes/" + qrId;
    return this.httpClient.get<ResultCode>(url).map(data => data).toPromise().then(x => {
      console.log("x=" + JSON.stringify(x));
      return x;
    });
  }

  getEmp(openId:string):Promise<ResultCode>{
    let url=this.wxCodeService.baseUrl+"/public/empByOpenId/"+openId;
    return this.httpClient.get<ResultCode>(url).map(data => data).toPromise().then(x => {
      console.log("x=" + JSON.stringify(x));
      return x;
    });
  }

  async validateAgent(agent: Agent): Promise<boolean> {
    console.log("agent=" + JSON.stringify(agent));
    if (!agent.certId || !agent.certName || !agent.wxUserId)
      return false;

    if (!agent.address || !agent.storeName)
      return false;

    if (!agent.bankName || !agent.bankAccount)
      return false;

    if (!this.validateCertId(agent.certId))
      return false;

    let resultCode = await  this.validateWxUserId(agent.wxUserId);
    //TODO 提示微信号录入错误。
    console.log("validate result=" + resultCode.data);

    if (!resultCode.data){
      alert("微信号不正确！");
      return false;
    }


    return true;
  }

  validateWxUserId(wxUserId: number): Promise<ResultCode> {
    return this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/validateWxUserId/" + wxUserId).toPromise();
  }


  //根据手机或昵称查找微信ID
  getWxUserIdByTeleOrNickName(): Promise<any[]> {
    return null;
  }

  addOrderTele(tele:string): Promise<any> {
    let url=this.wxCodeService.baseUrl+"/public/addOrder";
    return this.httpClient.post(url,{qrId:this.qrId,openId:this.openId,tele:tele}).toPromise();
  }

  //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
  //如果有兴趣，还可以加上身份证所在地的验证，就是前6位有些数字合法有些数字不合法。

  validateCertId(num): boolean {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
      alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
      return false;
    }
    else
      return true;
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    // var len, re;
    // len = num.length;
    // if(len!=18) return false;
    //
    // if (len == 18) {
    //   re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    //   var arrSplit = num.match(re);
    //   //检查生日日期是否正确
    //   var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    //   var bGoodDay;
    //   bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
    //     && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
    //     && (dtmBirth.getDate() == Number(arrSplit[4]));
    //   if (!bGoodDay) {
    //     alert(dtmBirth.getFullYear());
    //     alert(arrSplit[2]);
    //     alert('输入的身份证号里出生日期不对！');
    //     return false;
    //   } else {
    //     //检验18位身份证的校验码是否正确。
    //     //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //     var valnum;
    //     var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    //     var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    //     var nTemp = 0, i;
    //     for (i = 0; i < 17; i++) {
    //       nTemp += num.substr(i, 1) * arrInt[i];
    //     }
    //     valnum = arrCh[nTemp % 11];
    //     if (valnum != num.substr(17, 1)) {
    //       alert('18位身份证的校验码不正确！应该为：' + valnum);
    //       return false;
    //     }
    //     return num;
    //   }
    // }
    // return false;
  }


}

