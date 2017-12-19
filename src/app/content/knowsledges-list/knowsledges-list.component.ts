import { Component, OnInit } from '@angular/core';
import {ResultCode} from "../../result-code";
import {WxCodeService} from "../../wx-code.service";
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {WxArticleService} from "../article-service";

@Component({
  selector: 'app-knowsledges-list',
  templateUrl: './knowsledges-list.component.html',
  // styleUrls: ['./knowsledges-list.component.css']
  // templateUrl: '../article-list/article-list.component.html',
  styleUrls: ['../article-list/article-list.component.css']
})
export class KnowsledgesListComponent implements OnInit {


  constructor(public wxCodeService: WxCodeService, private  httpClient: HttpClient,private  router:Router ,public  wxArticleService:WxArticleService) {
  }

  ngOnInit() {
    if(this.wxCodeService.wxUser) {
      this.wxArticleService.getKnowlegeArticle(this.wxCodeService.wxUser);
      return;
    }
    var x = this.httpClient.get<ResultCode>(this.wxCodeService.getCodeToWxUserUrl() + this.wxCodeService.getCode()).subscribe(data => {
        this.wxCodeService.wxUser = data["data"];
        this.wxArticleService.getKnowlegeArticle(this.wxCodeService.wxUser);
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
