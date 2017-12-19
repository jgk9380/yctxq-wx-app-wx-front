import { Component, OnInit } from '@angular/core';
import {ResultCode} from "../../result-code";
import {WxCodeService} from "../../wx-code.service";
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {WxArticleService} from "../article-service";

@Component({
  selector: 'app-favorite-list',
  // templateUrl: '../article-list/article-list.component.html',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['../article-list/article-list.component.css']
})
export class FavoriteListComponent implements OnInit {

  wxUser: {openId:string};
  articleList:any[];

  constructor(public wxCodeService: WxCodeService, private  httpClient: HttpClient,private  router:Router ,public  wxArticleService:WxArticleService) {
  }

  ngOnInit() {
    if(this.wxCodeService.wxUser) {
      this.wxArticleService.getFavoriteArticle(this.wxCodeService.wxUser);
      return;
    }
    var x = this.httpClient.get<ResultCode>(this.wxCodeService.getCodeToWxUserUrl() + this.wxCodeService.getCode()).subscribe(data => {
        this.wxCodeService.wxUser = data["data"];
        this.wxArticleService.getFavoriteArticle(this.wxCodeService.wxUser);
      }
    );
  }

  getImgUrl(imgUrl:string):string{
    return "http://www.cu0515.com:8030/wd"+imgUrl;
  }

  getDate():Date{
    return (new Date());
  }

  clickTitle(id:number){
    console.log("clicked "+id);
    this.router.navigate(['/content/article', id]);
  }


}
