import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BindComponent } from './bind/bind.component';

import {AppRouterModule} from "./app.router";
import {HttpClientModule} from "@angular/common/http";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToasterService, ToasterModule} from "angular2-toaster";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {WxCodeService} from "./wx-code.service";
import {ScanRouteModule} from "./scan/scan.route";
import {ScanModule} from "./scan/scan.module";




@NgModule({
  declarations: [
    AppComponent,
    BindComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    HttpClientModule,
    FormsModule,
    ToasterModule,
    ScanModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy, },ToasterService,WxCodeService],//tomcat下路由刷新的问题

  bootstrap: [AppComponent]
})

export class AppModule { }
