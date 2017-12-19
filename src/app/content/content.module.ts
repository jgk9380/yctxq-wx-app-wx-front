import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleListComponent} from './article-list/article-list.component';

import {ArticleComponent} from './article/article.component';

import {ContentMainComponent} from './content-main.component';
import {ContentRouterModule} from "./content.router";
import {ToasterService, ToasterModule} from "angular2-toaster";
import {DialogModule,ButtonModule,InputTextareaModule} from 'primeng/primeng';
import { NewsListComponent } from './news-list/news-list.component';
import { KnowsledgesListComponent } from './knowsledges-list/knowsledges-list.component';
import { FavoriteListComponent } from './favorite-list/favorite-list.component'
import {WxArticleService} from "./article-service";
import { NewArticleComponent } from './new-article/new-article.component';
import { NewArticleListComponent } from './new-article-list/new-article-list.component';
@NgModule({
  imports: [
    CommonModule,
    ContentRouterModule,
    // HttpClientModule
    ToasterModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule
  ],
  declarations: [
    ArticleListComponent,
    ArticleComponent,
    ContentMainComponent,
    NewsListComponent,
    KnowsledgesListComponent,
    FavoriteListComponent,
    NewArticleComponent,
    NewArticleListComponent
  ],
  providers:[ToasterService,WxArticleService]
})

export class ContentModule {
}
