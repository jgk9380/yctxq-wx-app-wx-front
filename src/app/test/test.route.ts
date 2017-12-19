import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Routes,RouterModule} from '@angular/router';
import {TestAssetsComponent} from "./test-assets/test-assets.component";
import {MainComponent} from "./main/main.component";


const routes: Routes = [
  {
    path: '',component: MainComponent,
    children: [
      {path: 'test-img', component: TestAssetsComponent},
      // {path: 'main', component: MainComponent},
      // {path: 'knowledge', component: KnowledgesComponent}
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

export class TestRouterModule {

}

