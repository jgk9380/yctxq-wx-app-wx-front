import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScanHubComponent} from "./scan-hub.component";
import {AgentAddComponent} from "./agent-add/agent-add.component";
import {UserDeveloperComponent} from "./user-developer/user-developer.component";

const routes: Routes = [
  {
    path: ":openId/:qrId", component: ScanHubComponent, children:
      [
        {path: 'agent-add', component: AgentAddComponent},
        {path: 'user-dev', component: UserDeveloperComponent},
      ]
  }
];

@NgModule({
  imports: [
    //ClientFrameRouteModule,
    RouterModule.forChild(routes,),
    // {preloadingStrategy: PreloadAllModules,useHash:true}
  ],
  exports: [
    RouterModule
  ]
})
export class ScanRouteModule {
}
