import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'content-main',
  template: `<router-outlet></router-outlet>`,
  // styleUrls: ['./main.component.css']
})
export class ContentMainComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

}
