 import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AgentAddComponent } from './agent-add/agent-add.component';
import { ScanHubComponent } from './scan-hub.component';
import { UserDeveloperComponent } from './user-developer/user-developer.component';
 import {ScanRouteModule} from "./scan.route";
 import {ScanService} from "./scan.service";
 import { FormsModule }   from '@angular/forms';
 import {AutoCompleteModule} from 'primeng/primeng'
 import {NumberInput} from "./number-input-director";
@NgModule({
  imports: [
    CommonModule,
    ScanRouteModule,
    AutoCompleteModule,
    FormsModule,
  ],
  declarations: [AgentAddComponent, ScanHubComponent, UserDeveloperComponent,NumberInput],
  providers:[ScanService]
})
export class ScanModule { }
