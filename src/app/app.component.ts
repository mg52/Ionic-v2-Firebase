import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { ShowDataPage } from '../pages/show-data/show-data';
import { EnterDataPage } from '../pages/enter-data/enter-data';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';

import { MapData } from '../providers/map-data';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class Ionic_2_Firebase {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Enter Data', component: TabsPage, tabComponent: EnterDataPage, icon: 'create' },
    { title: 'Show Data', component: TabsPage, tabComponent: ShowDataPage, index: 1, icon: 'clipboard' },
    { title: 'Map', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public mapData: MapData,
    public storage: Storage
  ) {

    mapData.load();

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
      if(hasLoggedIn){
        this.rootPage = TabsPage;
      }
      else{
        this.rootPage = LoginPage;
      }
    });

    this.platformReady();

    this.listenToLoginEvents();

  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
        this.nav.setRoot(LoginPage);
      }, 100);
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
      this.nav.setRoot(TabsPage);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
      this.nav.setRoot(TabsPage);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
    });

    /*this.platform.registerBackButtonAction(() => {
        if(this.getActivePage() == 'TabsPage'){
          this.platform.exitApp();
        }
        else{
          event.preventDefault();
        }

      });*/
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

  getActivePage() {
    if(this.nav.getActive())
      return this.nav.getActive().name;
    else
      return '';
  }
}
