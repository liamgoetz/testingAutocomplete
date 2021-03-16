import { Component, Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subscription } from "rxjs";
import {
  tap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class Service {
  constructor(private http: HttpClient) {}

  opts = [];

  userIdOpts = [];

  getData() {
    console.log("GETTING TITLE");
    return this.opts.length
      ? of(this.opts)
      : this.http
          .get<any>("https://jsonplaceholder.typicode.com/todos")
          .pipe(tap(data => (this.opts = data)));
  }

  getUserIdData() {
    console.log("GETTING DATA");
    return this.userIdOpts.length
      ? of(this.userIdOpts)
      : this.http
          .get<any>("https://jsonplaceholder.typicode.com/todos")
          .pipe(tap(data => (this.userIdOpts = data)));
  }
}

/**
 * @title Simple autocomplete
 */
@Component({
  selector: "autocomplete-simple-example",
  templateUrl: "autocomplete-simple-example.html",
  styleUrls: ["autocomplete-simple-example.css"]
})
export class AutocompleteSimpleExample {
  idControl = new FormControl();
  myControl = new FormControl();

  idoptions = [];
  filteredOptions: Observable<any[]>;
  filteredIdOptions: Observable<any[]>;

  constructor(private service: Service) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || "");
      })
    );

    console.log(this.idControl.valueChanges);

    this.filteredIdOptions = this.idControl.valueChanges.pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterUserId(val || "");
      })
    );
  }

  ngOnInit() {}

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.service.getData().pipe(
      map(response =>
        response.filter(option => {
          return (
            option.title.toLowerCase().indexOf(val.toLowerCase()) === 0 &&
            option.userId === this.idControl.value
          );
        })
      )
    );
  }

  filterUserId(val: string): Observable<any[]> {
    // call the service which makes the http-request

    return this.service.getUserIdData().pipe(
      map(response =>
        response.filter(option => {
          return option.userId === val;
        })
      )
    );
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
