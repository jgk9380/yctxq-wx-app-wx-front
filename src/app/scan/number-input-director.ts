import { Directive } from '@angular/core';
import { NgModel }   from '@angular/forms';

// 自定义指令
@Directive({
  selector: 'input-number',
  host: {
    '(keypress)': 'onkeypress($event)',
    '(keyup)': 'onkeyup($event)'
  },
  inputs: ['maxValue'],
})

export class NumberInput {
  maxValue: number;

  constructor(public control: NgModel) {
  }

  onkeyup(event) {
    let input = event.target;
    if (input.value == "") {
      input.value = 0;
      this.control.viewToModelUpdate(0);
    }
    let newValue = parseInt(input.value);
    if (newValue > this.maxValue) {
      input.value = this.maxValue;
      this.control.viewToModelUpdate(this.maxValue);
    }
    else
    {
      input.value = newValue;
      this.control.viewToModelUpdate(newValue);
    }

  }

  onkeypress(event) {
    // 判断是否为数字
    let inputStr = String.fromCharCode(event.keyCode);
    if (!parseInt(inputStr)) {
      return false;
    }
  }

}
