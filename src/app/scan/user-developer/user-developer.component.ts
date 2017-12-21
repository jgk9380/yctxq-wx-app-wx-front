import {Component, OnInit} from '@angular/core';
import {ScanService} from "../scan.service";

@Component({
  selector: 'app-user-developer',
  templateUrl: './user-developer.component.html',
  styleUrls: ['./user-developer.component.css']
})
export class UserDeveloperComponent implements OnInit {
  // window.location.href="https://m.10010.com/queen/tencent/new-fill.html?product=0&channel=110&mobile="+tele;
  tele:string;

  constructor(private  scanService:ScanService) {

  }

  ngOnInit() {

  }

  addBill() {
    window.location.href="https://m.10010.com/queen/tencent/new-fill.html?product=0&channel=110&mobile="+this.tele;
  }
}
