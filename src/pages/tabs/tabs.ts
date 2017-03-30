import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { EnterDataPage } from '../enter-data/enter-data';
import { ShowDataPage } from '../show-data/show-data';
import { MapPage } from '../map/map';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = EnterDataPage;
  tab2Root: any = ShowDataPage;
  tab3Root: any = MapPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
