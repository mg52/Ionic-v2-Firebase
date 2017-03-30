import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { DataPopoverPage } from '../data-popover/data-popover';

@Component({
  selector: 'page-data-detail',
  templateUrl: 'data-detail.html'
})
export class DataDetailPage {
  data: any;

  constructor(public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.data = navParams.data;
  }

  more(event: Event) {
    let popover = this.popoverCtrl.create(DataPopoverPage, {data: this.data});
    popover.present({ ev: event });
  }
}
