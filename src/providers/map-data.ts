import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  data: any;

  constructor(public http: Http, public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();
    return this.data;
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

}
