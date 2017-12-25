import {Component, OnInit} from '@angular/core';
import {ScanService} from "../scan.service";
import {HttpClient} from '@angular/common/http';
import {WxCodeService} from "../../wx-code.service";
import {ResultCode} from "../../result-code";

@Component({
  selector: 'app-agent-add',
  templateUrl: './agent-add.component.html',
  styleUrls: ['./agent-add.component.css']
})
export class AgentAddComponent implements OnInit {
  agent: Agent = new Agent();
  banks: string[] = ['中国银行', '农业银行', '建设银行', '工商银行', '邮政银行'];
  filteredbanks: any[];

  constructor(private  scanService: ScanService, private  httpClient: HttpClient, private wxCodeService: WxCodeService) {

  }

  ngOnInit() {
  }

  filterBank(event) {
    // this.filteredBrands = [];
    // for(let i = 0; i < this.brands.length; i++) {
    //   let brand = this.brands[i];
    //   if(brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //     this.filteredBrands.push(brand);
    //   }
    // }
  }

  filterBanks(event) {
    this.filteredbanks = [];
    for (let i = 0; i < this.banks.length; i++) {
      let brand = this.banks[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredbanks.push(brand);
      }
    }
  }

  async submit() {

    let b = await  this.scanService.validateAgent(this.agent);
    if (!b) {
      alert("验证错误");
      return;
    }
    this.agent.addOpenId = this.scanService.openId;
    this.httpClient.put<ResultCode>(this.wxCodeService.baseUrl + "/public/wxAgent/" + this.scanService.qrId, this.agent)
      .toPromise()
      .then(x => {
        if (x.code != 0)
          alert(x.msg);
        else {
          alert("代理商信息提交成功！");
        }
        //window.close();
      })
      .catch(err => alert("错误:" + JSON.stringify(err)));
  }


}

export class Agent {
  wxUserId: number;
  certId: string;
  certName: string;
  address: string;
  bankName: string;
  bankAccount: string;
  storeName: string;
  addOpenId: string;
}
