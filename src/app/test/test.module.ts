import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestAssetsComponent } from './test-assets/test-assets.component';
import {TestRouterModule} from "./test.route";
import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    CommonModule,
    TestRouterModule
  ],
  declarations: [TestAssetsComponent, MainComponent]
})
export class TestModule { }
