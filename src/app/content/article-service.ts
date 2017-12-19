import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResultCode} from "../result-code";
import "rxjs/add/operator/map"
import {WxCodeService} from "../wx-code.service";
import {Router} from '@angular/router';

@Injectable()
export class WxArticleService {
  articleList: any[];
  listTitle: string;
  listType:string="news";

  constructor(public wxCodeService: WxCodeService, private  httpClient: HttpClient, private  router: Router) {
  }

  getNewsArticle(wxUser: any) {
    this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/article/newsList/" + wxUser.openId)
      .subscribe(data1 => {
        this.articleList = data1.data;
      });
    this.listTitle = "通信新闻";
    this.listType="news";
  }

  getFavoriteArticle(wxUser: any) {
    this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/article/favoriteList/" + wxUser.openId)
      .subscribe(data1 => {
        this.articleList = data1.data;


      });
    this.listTitle = "我的收藏";
    this.listType="favorite";
  }

  getKnowlegeArticle(wxUser: any) {
    this.httpClient.get<ResultCode>(this.wxCodeService.baseUrl + "/public/article/knowledgesList/" + wxUser.openId)
      .subscribe(data1 => {
        this.articleList = data1.data;
      });
    this.listTitle = "通信知识";
    this.listType="knowledge";
  }
}
