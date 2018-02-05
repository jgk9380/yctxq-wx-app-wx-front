import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';

import {ArticleListComponent} from "./article-list/article-list.component";

import {ContentMainComponent} from "./content-main.component";

import {KnowsledgesListComponent} from "./knowsledges-list/knowsledges-list.component";
import {FavoriteListComponent} from "./favorite-list/favorite-list.component";
import {NewArticleListComponent} from "./new-article-list/new-article-list.component";
import {NewArticleComponent} from "./new-article/new-article.component";



const routes: Routes = [
  {
    path: '', component:ContentMainComponent,
    children: [
      {path: 'list', component: ArticleListComponent},
      {path: 'knowledge-list', component: KnowsledgesListComponent},
      {path: 'favorite-list', component: FavoriteListComponent},
      {path: 'n-list/:type', component: NewArticleListComponent},
      {path: 'n-article/:id/:share-id', component: NewArticleComponent},
      //{path: 'knowledge', component: KnowledgesComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})

export class ContentRouterModule {

}
