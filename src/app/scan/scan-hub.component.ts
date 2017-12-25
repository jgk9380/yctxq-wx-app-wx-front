import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import "rxjs/add/operator/map";
import {ScanService} from "./scan.service";

@Component({
  selector: 'app-scan-hub',
  template: `       <router-outlet></router-outlet>  `,
  styles: []
})
export class ScanHubComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private  scanService: ScanService) {
  }

  async ngOnInit() {
    // let qrCodeId= this.route.paramMap.map((params: ParamMap) =>params.get("openId"))
    let qrCodeId = +this.route.snapshot.paramMap.get('qrId');
    this.scanService.qrId=qrCodeId;
    let openId = this.route.snapshot.paramMap.get('openId');
    this.scanService.openId=openId;
    let wxQrCode: any = await this.scanService.getQrInfo(qrCodeId);
    let empInfo:any =await  this.scanService.getEmp(openId);

     if (!wxQrCode.wxUserId&&empInfo.code==0) {
    // alert(wxQrCode.wxUserId);
    // alert(empInfo.code);
    //  if (!wxQrCode.wxUserId) {
      this.router.navigate(['agent-add'], {relativeTo: this.route});
    }
    else
      this.router.navigate(['user-dev'], {relativeTo: this.route});
  }


}
