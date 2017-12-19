/**
 * Created by jianggk on 2017/1/10.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {BindComponent} from "./bind/bind.component";
import {ScanComponent} from "./scan/scan.component";

import {AppComponent} from "./app.component";


const routes: Routes = [
  {path: '', redirectTo: '/content/list',pathMatch:"full"},
  {path: 'bind', component: BindComponent},
  {path: 'scan', component: ScanComponent},
  {path: 'content', loadChildren: "app/content/content.module#ContentModule"},
  {path: 'test', loadChildren: "app/test/test.module#TestModule"},
  // {path: 'main', component: AppComponent}
];

@NgModule({
  imports: [
    //ClientFrameRouteModule,
    RouterModule.forRoot(routes,),
    // {preloadingStrategy: PreloadAllModules,useHash:true}
  ],
  exports: [
    RouterModule
  ]
})

export class AppRouterModule {

}
