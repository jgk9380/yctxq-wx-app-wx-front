import {Component, OnInit} from '@angular/core';
import {WxCodeService} from "../../wx-code.service";
import {WxArticleService} from "../article-service";
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-new-article-list',
  templateUrl: './new-article-list.component.html',
  styleUrls: ['./new-article-list.component.css']
})
export class NewArticleListComponent implements OnInit {

//wxUser: {openId:string};
  constructor(private route: ActivatedRoute, public wxCodeService: WxCodeService, private  httpClient: HttpClient, private  router: Router, public  wxArticleService: WxArticleService) {
  }

  async ngOnInit() {
    let wxUser = await  this.wxCodeService.getWxUser();
    //console.log("wxUser=" + JSON.stringify(wxUser));
    //let sharer = await  this.wxCodeService.getSharer();
    this.route.paramMap.map((params: ParamMap) => {
      return "" + params.get("type")
    }).subscribe(x => {
      if(x=="news") {
        this.wxArticleService.getNewsArticle(wxUser);
        return ;
      }
      if(x=="favorite") {
        this.wxArticleService.getFavoriteArticle(wxUser);
        return;
      }
      if(x=="knowledge") {
        this.wxArticleService.getKnowlegeArticle(wxUser);
        return;
      }
    });
    //this.init();
  }

  async init() {
    let wxUser = await  this.wxCodeService.getWxUser();
    //let sharer = await  this.wxCodeService.getSharer();
    console.log("wxUser=" + JSON.stringify(wxUser));
    //console.log("sharer=" + JSON.stringify(sharer));
  }

  getImgUrl(imgUrl: string): string {
    return "http://www.cu0515.com:8030/wd" + imgUrl;
  }

  getDate(): Date {
    return (new Date());
  }

  clickTitle(id: number) {
    // console.log("clicked "+id);
    this.router.navigate(['/content/n-article', id,0]);
  }
}
