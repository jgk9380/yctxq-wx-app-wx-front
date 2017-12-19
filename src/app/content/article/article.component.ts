import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
// import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {WxCodeService} from "../../wx-code.service";
import {ResultCode} from "../../result-code";
import {ToasterConfig, ToasterService} from 'angular2-toaster';

// import {Observable} from 'rxjs/Observable';

declare var wx: any;

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit, AfterViewInit {

  wxArticle: any;
  qrCodeUrl: string;
  wxQrCodeUrl: string;
  articleOperate: ArticleOperate = new ArticleOperate();
  inputDialogShowed: boolean = false;
  jsTicket: any;

  toasterConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: true,
    timeout: 1000,
    positionClass: "toast-center"
  });

  constructor(private route: ActivatedRoute, private  httpClient: HttpClient, private  wxCodeService: WxCodeService, private  toasterService: ToasterService) {
  }

  async ngOnInit() {
    // this.route.paramMap
    //   .switchMap((params: ParamMap) => this.heroService.getHero(+params.get('id')))
    //   .subscribe(hero => this.hero = hero);

    //根据articleId初始化wxArticle数据。
    this.route.paramMap.map((params: ParamMap) => {
      return "" + params.get("id")
    }).subscribe(x => {
      let articleUrl = this.wxCodeService.baseUrl + "/public/article/" + x;
      //console.log("articleUrl=" + articleUrl);
      this.httpClient.get<ResultCode>(articleUrl).subscribe(data => {
        this.wxArticle = data.data;
        //todo 1、保存阅读次数及阅读记录数据            //readArticle/{articleId}/{openId}/{shareId}
        let articleReadHistoryUrl: string = this.wxCodeService.baseUrl + "/public/article/readArticle/" + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId + "/" + this.wxCodeService.getShareId();
        // console.log("articleReadHistoryUrl=" + articleReadHistoryUrl);
        this.httpClient.post<ResultCode>(articleReadHistoryUrl, {})
          .toPromise()
          .then(x => console.log("readHistory returns:" + JSON.stringify(x)));

        //todo 2、初始化operate数据
        let initialStatusUrl: string = this.wxCodeService.baseUrl + "/public/article/initialStatus/" + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId;
        this.httpClient.get<ResultCode>(initialStatusUrl, {})
          .toPromise()
          .then(x => {
            this.articleOperate = x.data;
            //console.log("x.data=" + JSON.stringify(x.data))
          });

        //todo  3、取jsticket    //todo wx.config
        console.log("---3--")
        console.log("this.wxArticle=" + this.wxArticle.id);

        //alert("---href=" + location.href)
        //warn 电脑上的测试URL
        let pcUrl: string;
        // {
        //   pcUrl= location.href;
        //   alert(pcUrl);
        // }
        //warn 手机上用的URL

        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let jsTicketUrl: string;//= "http://www.cu0515.com/wx-front/";
        //alert(phoneUrl);
        if (isiOS)
          jsTicketUrl ="http://www.cu0515.com/wx-front/index.html?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/news-list";
        // jsTicketUrl = location.href;
        if (isAndroid)
         //jsTicketUrl = "http://www.cu0515.com/wx-front/index.html";
         //jsTicketUrl ="http://www.cu0515.com/wx-front/index.html/?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/news-list";
         jsTicketUrl = location.href;
          //jsTicketUrl ="http://www.cu0515.com/wx-front";

        //alert("jsTicketUrl-11=" + jsTicketUrl);

        this.httpClient.post<ResultCode>(this.wxCodeService.baseUrl + "/wx/jsTicket", {url: jsTicketUrl})
          .toPromise()
          .then(jsticketJson => {
            console.log("jsticket=" + JSON.stringify(jsticketJson.data));
            let jstickeData = jsticketJson.data;
            //wx.config()
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: jstickeData.appId, // 必填，公众号的唯一标识
                timestamp: jstickeData.timestamp, // 必填，生成签名的时间戳
                nonceStr: jstickeData.nonceStr, // 必填，生成签名的随机串
                signature: jstickeData.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              }
            );
          });


        //todo 配置wx.ready

        let shareTitle = this.wxArticle.title;
        let sharePictureUrl = "http://www.cu0515.com:8030/wd" + this.wxArticle.pictureUrl;
        this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/article/getCurrentShareId")
          .toPromise()
          .then(x => {
            //alert("getCurrentShareId=" + JSON.stringify(x.data));
            let currentShareId = x.data;
            let shareSourceUrl = "?shareId=" + currentShareId.firstShareId + "#/content/article/" + this.wxArticle.id;
            // let shareTimesUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=http://www.cu0515.com/wx-front/index.html"
            //   + shareSourceUrl + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";//TODO stateId改成shareId
            let shareTimesUrl = "http://www.cu0515.com/wx-front/index.html" + shareSourceUrl;
            //alert("---shareTimesUrl=" + shareTimesUrl);
            let postShareTimesUrl = this.wxCodeService.baseUrl + "/public/article/shareArticle/" + this.wxArticle.id + "/"
              + this.wxCodeService.wxUser.openId + "/times/" + currentShareId.firstShareId + "/" + this.wxCodeService.getShareId();
            let postShareAppUrl = this.wxCodeService.baseUrl + "/public/article/shareArticle/" + this.wxArticle.id + "/"
              + this.wxCodeService.wxUser.openId + "/app/" + currentShareId.secondShareId + "/" + this.wxCodeService.getShareId();
            //console.log("postShareUrl=" + postShareTimesUrl);

            let httpClientProxy = this.httpClient;
            //todo wx.ready
            wx.ready(function () {
              console.log("--wxReady--")
              wx.onMenuShareAppMessage({  //配置分享给朋友接口
                title: shareTitle, // 分享标题shareTitle
                desc: "最新的通信新闻知识", // 分享描述
                link: shareTimesUrl, // 分享链接 todo 含分享ID  什么多不要想
                imgUrl: sharePictureUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  // 用户确认分享后执行的回调函数
                  //"/shareArticle/{articleId}/{openId}/{shareType}/{currentShareId}/{lastShareId}
                  console.log("--share success--");
                  console.log("------postShareURL+" + postShareAppUrl);
                  httpClientProxy.post(postShareAppUrl, {})
                    .toPromise()
                    .then(shareResult => console.log("----shareReslult-" + JSON.stringify(shareResult)))
                    .catch(error => console.log("error=" + JSON.stringify(error)));
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  console.log("--share cancel--");
                }
              });

              wx.onMenuShareTimeline({  //配置分享给朋友接口
                title: shareTitle, // 分享标题shareTitle
                desc: "最新的通信新闻知识", // 分享描述
                link: shareTimesUrl, // 分享链接 todo 含分享ID
                imgUrl: sharePictureUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  // 用户确认分享后执行的回调函数
                  //"/shareArticle/{articleId}/{openId}/{shareType}/{currentShareId}/{lastShareId}
                  console.log("--share success--");
                  console.log("------postShareURL+" + postShareTimesUrl);
                  httpClientProxy.post(postShareTimesUrl, {})
                    .toPromise()
                    .then(shareResult => console.log("----shareReslult-" + JSON.stringify(shareResult)))
                    .catch(error => console.log("error=" + JSON.stringify(error)));
                },
                cancel: function(){
                  // 用户取消分享后执行的回调函数
                  console.log("--share cancel--");
                }
              });
            });
          });
      })
    });

    //取传播二维码
    this.getQrCodeUrl().then(x => {
      this.qrCodeUrl = this.wxCodeService.baseUrl + "/public/show_pict/" + x;
      //console.log("qrCodeUrl=" + this.qrCodeUrl);
    });

    //取微信二维码
    this.getWxQrCodeUrl().then(vv => {
      //console.log("v=" + JSON.stringify(vv))
      this.wxQrCodeUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + vv.ticket;

    });


  }

  getQrCodeUrl(): Promise<string> {
    let imgUrl = this.wxCodeService.baseUrl + "/public/article/qrCodeIdByShareId/" + this.wxCodeService.getShareId();
    //console.log("imgUrl=" + imgUrl);
    return this.httpClient.get<ResultCode>(imgUrl).map(x => x.data).toPromise();
  }

// /public/userPermQrCode/{openId}
  getWxQrCodeUrl(): Promise<any> {
    //let imgUrl: any; //this.wxCodeService.baseUrl + "/public/userPermQrCode/" + ;
    //console.log("imgUrl=" + imgUrl);
    // return this.wxCodeService.wxUser()
    //   .then(x => imgUrl = this.wxCodeService.baseUrl + "/public/userPermQrCode/" + x.openId)
    //   .then(y => this.httpClient.get<ResultCode>(y).map(z => z.data).toPromise())
    let wxQrCodeUrl = this.wxCodeService.baseUrl + "/public/userPermQrCode/" + this.wxCodeService.wxUser.openId;
    console.log("wxQrCodeUrl=" + wxQrCodeUrl);
    return this.httpClient.get<ResultCode>(wxQrCodeUrl)
      .map(x => {
        // x.data;
        //console.log("x.data=" + JSON.stringify(x.data));
        return x.data;
      }).toPromise();
  }

  getDate(): Date {
    return (new Date());
  }

  favriteArticle() {
    this.articleOperate.favorite = !this.articleOperate.favorite;
    if (this.articleOperate.favorite) {
      //favoriteArticle/{articleId}/{openId}/{shareId}
      let favoriteArticleUrl = this.wxCodeService.baseUrl + "/public/article/favoriteArticle/"
        + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId + "/" + this.wxCodeService.getShareId();
      //console.log("favoriteArticleUrl=" + favoriteArticleUrl);
      this.httpClient.post<ResultCode>(favoriteArticleUrl, {})
        .toPromise()
        .then(x => {
            //console.log("x=" + JSON.stringify(x));
            this.toasterService.pop({type: 'success', title: "ok", body: x.msg, showCloseButton: true,});
          }
        );
      this.wxArticle.favoriteCount = (this.wxArticle.favoriteCount || 0) + 1;
    }
    else {
      let cancelFavoriteArticleUrl = this.wxCodeService.baseUrl + "/public/article/cancelfavoriteArticle/"
        + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId;
      //console.log("favoriteArticleUrl=" + cancelFavoriteArticleUrl);
      this.httpClient.post<ResultCode>(cancelFavoriteArticleUrl, {})
        .toPromise()
        .then(x => this.toasterService.pop({type: 'success', title: "ok", body: x.msg, showCloseButton: true,})
        );
      this.wxArticle.favoriteCount = this.wxArticle.favoriteCount - 1;
    }
  }

  likeArticle() {
    this.articleOperate.like = !this.articleOperate.like;

    if (this.articleOperate.like) {
      this.backLikeArticle();
      this.wxArticle.likeCount = (this.wxArticle.likeCount || 0) + 1;
    }
    else {
      this.backCancelLikeArticle();
      this.wxArticle.likeCount = this.wxArticle.likeCount - 1;
    }

    if (this.articleOperate.like) {
      if (this.articleOperate.hate) {
        this.articleOperate.hate = false;
        this.wxArticle.hateCount = (this.wxArticle.hateCount || 0) - 1;
        this.backCancelHateArticle();
      }
    }
    console.log("like=" + this.articleOperate.like + "  likeCoutnt=" + this.wxArticle.likeCount);

    // this.toasterService.pop({
    //   type: 'success',
    //   title: "ok",
    //   body: this.articleOperate.like ? "赞了一下" : "不赞了",
    //   showCloseButton: true,
    // });

  }

  backLikeArticle() {
    let likeArticleUrl = this.wxCodeService.baseUrl + "/public/article/likeArticle/"
      + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId + "/" + this.wxCodeService.getShareId();
    this.httpClient.post<ResultCode>(likeArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backCancelLikeArticle() {
    let cancelLikeArticleUrl = this.wxCodeService.baseUrl + "/public/article/cancelLikeArticle/"
      + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId;
    this.httpClient.post<ResultCode>(cancelLikeArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backHateArticle() {
    let hateArticleUrl = this.wxCodeService.baseUrl + "/public/article/hateArticle/"
      + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId + "/" + this.wxCodeService.getShareId();
    this.httpClient.post<ResultCode>(hateArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backCancelHateArticle() {
    let cancelHateArticleUrl = this.wxCodeService.baseUrl + "/public/article/cancelHateArticle/"
      + this.wxArticle.id + "/" + this.wxCodeService.wxUser.openId;
    this.httpClient.post<ResultCode>(cancelHateArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "success",
      body: x.msg,
      showCloseButton: true,
    }));
  }


  hateArticle() {
    //console.log("hate it ");
    this.articleOperate.hate = !this.articleOperate.hate
    if (this.articleOperate.hate) {
      this.wxArticle.hateCount = (this.wxArticle.hateCount || 0) + 1;
      this.backHateArticle();
      if (this.articleOperate.like) {
        this.articleOperate.like = false;
        this.wxArticle.likeCount = this.wxArticle.likeCount - 1;
        this.backCancelLikeArticle();
      }
    }
    else {
      this.backCancelHateArticle()
      this.wxArticle.hateCount = this.wxArticle.hateCount - 1;
    }


    // this.toasterService.pop({
    //   type: 'success',
    //   title: "ok",
    //   body: this.articleOperate.hate ? "踩了一下" : "不踩了",
    //   showCloseButton: true,
    // });
  }

  showReplyDialog() {
    this.inputDialogShowed = true;
  }

  ngAfterViewInit(): void {
    // console.log("ngAfterViewInit()");

  }
}


class ArticleOperate {
  favorite: boolean;
  like: boolean;
  hate: boolean;
}

class ArticleHelper {

}
