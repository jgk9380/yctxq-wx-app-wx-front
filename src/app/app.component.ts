import {Component, OnInit,AfterViewInit} from "@angular/core";
import {WxCodeService} from "./wx-code.service";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";

declare var wx:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{

  title = 'app';
  constructor(private wxCodeService: WxCodeService,private router:Router) {

  }

  ngOnInit(){
    //alert("init it");
    this.wxCodeService.setCode(this.wxCodeService.getRequestParams()["code"]);
    this.wxCodeService.shareId= this.wxCodeService.getRequestParams()["shareId"];

    //console.log("--shareId="+this.wxCodeService.shareId+"  code="+this.wxCodeService.getRequestParams()["code"]);

    // wx.config({
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数
    //   appId: '', // 必填，公众号的唯一标识
    //   timestamp: , // 必填，生成签名的时间戳
    //   nonceStr: '', // 必填，生成签名的随机串
    //   signature: '',// 必填。注意，signature应由后台返回
    //   jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ'] // 必填
    // });

    //初始化wxUser，供其他组件调用。
    // this.wxCodeService.getWxUser().then(x=>{this.wxCodeService.wxUser=x;console.log("wxUser.nickname="+this.wxCodeService.wxUser.nickname);});

  }
  ngAfterViewInit() {
    //this.configWXShare();   //在根组件中配置分享
  }


}

