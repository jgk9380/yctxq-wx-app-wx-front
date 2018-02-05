import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
// import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {WxCodeService} from "../../wx-code.service";
import {ResultCode} from "../../result-code";
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import {WxArticleService} from "../article-service";

// import {Observable} from 'rxjs/Observable';

declare var wx: any;

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit {
  wxArticle: any;
  qrCodeUrl: string;
  wxQrCodeUrl: string;
  articleOperate: ArticleOperate = new ArticleOperate();
  inputDialogShowed: boolean = false;

  wxUser: any;
  sharer: any;
  shareId: number;


  toasterConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: true,
    timeout: 3000,
    positionClass: "toast-center"

  });

  constructor(private route: ActivatedRoute, private  httpClient: HttpClient, private  wxCodeService: WxCodeService,
              private  toasterService: ToasterService, private wxArticleService: WxArticleService) {
  }


  async ngOnInit() {
    let articleId = this.route.snapshot.params["id"];
    this.shareId = this.route.snapshot.params["share-id"];
    this.wxUser = await  this.wxCodeService.getWxUser();



    console.log("this1.wxUser=" + JSON.stringify(this.wxUser));
    console.log("shareId=" + this.shareId);
    this.sharer = await  this.wxCodeService.getSharer(this.shareId);
    console.log("this1.sharer=" + JSON.stringify(this.sharer));
    // let shareId = this.route.snapshot.params["shareId"];
    console.log("articleId=" + articleId);
    // console.log("shareId=" + shareId);
    //根据articleId初始化wxArticle数据。
    this.wxArticle = await  this.getWxArticle(articleId);
    if (!this.wxUser) {
      let baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=URL&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      let redirectUrl = "http://www.cu0515.com/wx-front/index.html#/content/n-article/" + this.wxArticle.id + "/" + this.shareId;
      //alert("!this.wxUser redto:"+redirectUrl);
      redirectUrl = encodeURIComponent(redirectUrl);
      let redirct = baseUrl.replace('URL', redirectUrl)
      location.href = redirct;
    }

    console.log("this.wxArticle.id=" + JSON.stringify(this.wxArticle.id));
    //get文章已读等数据
    this.articleOperate = await this.getArticleOperate();
    console.log("this.articleOperate.id=" + JSON.stringify(this.articleOperate));
    this.saveReadCount();
    //1、取传播二维码
    this.qrCodeUrl = this.wxCodeService.baseUrl + "/public/show_pict/" + (await this.getQrCodeUrl());
    //2、取微信二维码
    this.wxQrCodeUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + (await this.getWxQrCodeUrl()).ticket;
    //3、配置微信分享
    if (this.wxUser) {
      this.configCodeUserWx();
    }

  }

//根据ID取文章
  getWxArticle(id: number): Promise<any> {
    let articleUrl = this.wxCodeService.baseUrl + "/public/article/" + id;
    console.log("########articleUrl=" + articleUrl);
    return this.httpClient.get<ResultCode>(articleUrl).toPromise().then(x => x.data);
  }

//根据ID取文章状态
  getArticleOperate(): Promise<any> {
    let initialStatusUrl: string;
    initialStatusUrl = this.wxCodeService.baseUrl + "/public/article/initialStatus/" + this.wxArticle.id + "/" + this.getWxUserOpenId();
    return this.httpClient.get<ResultCode>(initialStatusUrl, {})
      .toPromise().then(x => x.data);
  }

  saveReadCount() {
    //todo 1、保存阅读次数及阅读记录数据            //readArticle/{articleId}/{openId}/{shareId}
    let articleReadHistoryUrl: string;
    articleReadHistoryUrl = this.wxCodeService.baseUrl + "/public/article/readArticle/" + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/" + this.shareId;
    // console.log("articleReadHistoryUrl=" + articleReadHistoryUrl);
    this.httpClient.post<ResultCode>(articleReadHistoryUrl, {})
      .toPromise()
      .then(x => console.log("readHistory returns:" + JSON.stringify(x)));
  }


  async configCodeUserWx() {
    console.log("xxxxxxxxxx=" + location.href.split('#')[0]);
    //根据终端类型get jsTicketUrl;
    let jsTicketUrl = this.getJsTicketUrl();
    this.httpClient.post<ResultCode>(this.wxCodeService.baseUrl + "/wx/jsTicket", {url: jsTicketUrl}).toPromise()
      .then(jsTicketJson => {
        //console.log("jsticket=" + JSON.stringify(jsTicketJson.data));
        let jsTicketData = jsTicketJson.data;
        let configData = {
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: jsTicketData.appId, // 必填，公众号的唯一标识
          timestamp: jsTicketData.timestamp, // 必填，生成签名的时间戳
          nonceStr: jsTicketData.nonceStr, // 必填，生成签名的随机串
          signature: jsTicketData.signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        wx.config(configData);
      });
//2、
    let currentShareId = await (this.getNextShareId());
    {//配置微信分享
      let shareTitle = this.wxArticle.title;
      let sharePictureUrl = "http://www.cu0515.com:8030/wd" + this.wxArticle.pictureUrl;
      let shareAppUrl = this.getShareAppUrl(currentShareId);
      let shareTimesUrl = this.getShareTimesUrl(currentShareId);
      let postShareTimesUrl = this.wxCodeService.baseUrl + "/public/article/shareArticle/" + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/times/" + currentShareId.firstShareId + "/" + this.shareId;
      let postShareAppUrl = this.wxCodeService.baseUrl + "/public/article/shareArticle/" + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/app/" + currentShareId.secondShareId + "/" + this.shareId;
      let httpClientProxy = this.httpClient;
      let onMenuShareAppMessageData = this.getOnMenuShareAppMessageData(shareTitle, shareAppUrl, sharePictureUrl, httpClientProxy, postShareAppUrl);
      let onMenuShareTimelineData = this.getOnMenuShareTimelineData(shareTitle, shareTimesUrl, sharePictureUrl, httpClientProxy, postShareTimesUrl);
      wx.ready(function () {
        wx.onMenuShareAppMessage(onMenuShareAppMessageData);
        wx.onMenuShareTimeline(onMenuShareTimelineData);
        wx.hideMenuItems({
          menuList: ["menuItem:copyUrl", "menuItem:favorite", "menuItem:openWithSafari"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
      });
    }
  }

  getIsAndroid() {
    let u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    return isAndroid;
  }

  getShareTimesUrl(currentShareId): any {
    if (this.getIsAndroid()) {
      let shareTimesUrl = "http://www.cu0515.com/wx-front/index.html#/content/n-article/" + this.wxArticle.id + "/" + currentShareId.firstShareId;
      return shareTimesUrl;
    }
    let baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=URL&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
    let shareTimesUrl = "http://www.cu0515.com/wx-front/index.html#/content/n-article/" + this.wxArticle.id + "/" + currentShareId.firstShareId;
    shareTimesUrl = encodeURIComponent(shareTimesUrl);
    let result = baseUrl.replace('URL', shareTimesUrl)
    console.log("--------shareTimeUrl result=" + result);
    return result;
  }

  getShareAppUrl(currentShareId) {
    if (this.getIsAndroid()) {
      let shareAppUrl = "http://www.cu0515.com/wx-front/index.html#/content/n-article/" + this.wxArticle.id + "/" + currentShareId.secondShareId;
      return shareAppUrl;
    }

    let baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=URL&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
    let shareAppUrl = "http://www.cu0515.com/wx-front/index.html#/content/n-article/" + this.wxArticle.id + "/" + currentShareId.secondShareId;

    shareAppUrl = encodeURIComponent(shareAppUrl);
    let result = baseUrl.replace('URL', shareAppUrl);
    console.log("--------getShareAppUrl result=" + result);
    return result;
  }

  getJsTicketUrl(): string {
    //alert(location.href);
    //不同的平台  获取jsTicketUrl的值是不一样的。

    let u = navigator.userAgent;
    //alert(u);
    console.log("-----navigator.userAgent=" + u);
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let jsTicketUrl: string = location.href;
    //return jsTicketUrl;//todo 用于测试


    /* */
    if (isiOS) {
      //alert(this.wxArticleService.listType);
      if (this.shareId == 0) {
        jsTicketUrl = "http://www.cu0515.com/wx-front/index.html?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/n-list/" + this.wxArticleService.listType;
        //jsTicketUrl=location.href;
        // console.log("############ ios 0 location.href=" + location.href);
        return jsTicketUrl;
      } else {
        //let baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=URL&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        let jsTicketUrl = "http://www.cu0515.com/wx-front/index.html?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/n-article/" + this.wxArticle.id + "/" + this.shareId;
        return jsTicketUrl;
      }
    }

    if (isAndroid) {
      //1
      //  alert("1");
      // jsTicketUrl = location.href;
      // return jsTicketUrl;
      //2
      //alert(2);
      jsTicketUrl = location.href.split('#')[0];
      //jsTicketUrl="http://www.cu0515.com/wx-front";
      //alert(jsTicketUrl);
      return jsTicketUrl;
      //3
      // alert(location.href);
      // alert(3);
      // if (this.shareId == 0) {
      //   // http://www.cu0515.com/wx-front/index.html?code=011z2bCU1zjTPU088AAU1eAnCU1z2bCZ&state=STATE#/content/n-list/news
      //   jsTicketUrl = "http://www.cu0515.com/wx-front/index.html?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/n-list/" + this.wxArticleService.listType;
      //   //jsTicketUrl=location.href;
      //   console.log("############ ios 0 location.href=" + location.href);
      //   return jsTicketUrl;
      // }else {
      //   //let baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7dcc6b2e03a47c0b&redirect_uri=URL&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      //   let jsTicketUrl = "http://www.cu0515.com/wx-front/index.html?code=" + this.wxCodeService.getCode() + "&state=STATE#/content/n-article/" + this.wxArticle.id + "/" + this.shareId;
      //   return jsTicketUrl;
      // }
      // //jsTicketUrl=location.href.split('#')[0]
    }

  }

  getOnMenuShareAppMessageData(shareTitle, shareAppUrl, sharePictureUrl, httpClientProxy, postShareAppUrl): any {
    let onMenuShareAppMessageData = {
      title: shareTitle, // 分享标题shareTitle
      desc: "最新的通信新闻知识", // 分享描述
      link: shareAppUrl, // 分享链接 todo 含分享ID  什么多不要想
      imgUrl: sharePictureUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        httpClientProxy.post(postShareAppUrl, {}).toPromise()
          .then(shareResult => {
              console.log("----shareReslult-" + JSON.stringify(shareResult));
            }
          )
          .catch(error => console.log("error=" + JSON.stringify(error)));
      },
      fail: function (res) {
        alert("fail" + res);
      }
    };
    return onMenuShareAppMessageData;
  }

  getOnMenuShareTimelineData(shareTitle, shareTimesUrl, sharePictureUrl, httpClientProxy, postShareTimesUrl): any {
    let onMenuShareTimelineData = {  //配置分享给朋友圈接口
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
        //alert("------postShareURL+" + postShareTimesUrl);
        //alert("------postShareURL+" + postShareTimesUrl);
        httpClientProxy.post(postShareTimesUrl, {})
          .toPromise()
          .then(shareResult => console.log("----shareReslult-" + JSON.stringify(shareResult)))
          .catch(error => console.log("error=" + JSON.stringify(error)));
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        console.log("--share cancel--");
      },
      fail: function (res) {
        alert("fail" + res);
      }
    };
    return onMenuShareTimelineData;
  }


  getNextShareId(): Promise<any> {
    return this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/article/getCurrentShareId")
      .toPromise()
      .then(x => x.data);
  }


  getQrCodeUrl(): Promise<string> {
    let imgUrl: string = this.wxCodeService.baseUrl + "/public/article/qrCodeIdByShareId/" + this.shareId;
    console.log("-------getQrCodeUrl.imgUrl=" + imgUrl);
    return this.httpClient.get<ResultCode>(imgUrl).map(x => x.data).toPromise();
  }

// /public/userPermQrCode/{openId}
  getWxQrCodeUrl(): Promise<any> {
    let wxQrCodeUrl: string;
    if (this.sharer)
      wxQrCodeUrl = this.wxCodeService.baseUrl + "/public/userPermQrCode/" + this.sharer.openId;
    else
      wxQrCodeUrl = this.wxCodeService.baseUrl + "/public/userPermQrCode/" + "null";

    console.log("-----wxQrCodeUrl=" + wxQrCodeUrl);

    return this.httpClient.get<ResultCode>(wxQrCodeUrl)
      .map(x => {
        return x.data;
      }).toPromise();
  }

  getDate(): Date {
    return (new Date());
  }

  getWxUserOpenId(): string {
    if (this.wxUser)
      return this.wxUser.openId;
    return "null";
  }

  favriteArticle() {
    if (!this.wxUser) {
      this.toasterService.pop({
        type: 'success',
        title: "ok",
        body: "登录公众号后才可收藏此文",
        showCloseButton: true,
      });
      return;
    }
    this.articleOperate.favorite = !this.articleOperate.favorite;
    if (this.articleOperate.favorite) {
      //favoriteArticle/{articleId}/{openId}/{shareId}
      let favoriteArticleUrl = this.wxCodeService.baseUrl + "/public/article/favoriteArticle/"
        + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/" + this.shareId;
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
        + this.wxArticle.id + "/" + this.getWxUserOpenId();
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
      + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/" + this.shareId;
    this.httpClient.post<ResultCode>(likeArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backCancelLikeArticle() {
    let cancelLikeArticleUrl = this.wxCodeService.baseUrl + "/public/article/cancelLikeArticle/"
      + this.wxArticle.id + "/" + this.getWxUserOpenId();
    this.httpClient.post<ResultCode>(cancelLikeArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backHateArticle() {
    let hateArticleUrl = this.wxCodeService.baseUrl + "/public/article/hateArticle/"
      + this.wxArticle.id + "/" + this.getWxUserOpenId() + "/" + this.shareId;
    this.httpClient.post<ResultCode>(hateArticleUrl, {}).toPromise().then(x => this.toasterService.pop({
      type: 'success',
      title: "ok",
      body: x.msg,
      showCloseButton: true,
    }));
  }

  backCancelHateArticle() {
    let cancelHateArticleUrl = this.wxCodeService.baseUrl + "/public/article/cancelHateArticle/"
      + this.wxArticle.id + "/" + this.getWxUserOpenId();
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


// 看我把这些坑都总结了一下：
// 要命的invalid signature。其实腾讯的文档已经写了，只能怪我自己理解能力太差，掉了好几次坑。
// 签名要用到的jsapi_ticket需要保存的，2小时有效期。如果在2小时内出现问题需要删除才能工作，一般是自身程序的问题，请检查。
// nonceStr和noncestr的大小写，当心！
// url一定要当心，如果是"http://x.com/jspay?oid=0&attr=1#wechat"的形式，那么应该保留的是"http://x.com/jspay?oid=0&attr=1"。
// 据此，url在JavaScript中是location.href.split('#')[0]获取。
// 据此，url在php中用$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]拼装，
// 据说会有多余的80端口问题，但是记录者没有遇到过，总之请小心。
// url在JavaScript中千万别忘记“encodeURIComponent”！否则后果很诡异，遇到过初始化的时候报invalid
// signature，但是API接口又能调用的情况。
