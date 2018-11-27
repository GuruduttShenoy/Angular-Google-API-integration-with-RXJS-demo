import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, switchMap, map, distinctUntilChanged, debounceTime, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { API_KEY } from './utilities/api-key';

const API_URL = 'https://www.googleapis.com/customsearch/v1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '-API integration Demo with';

  SearchForm: FormGroup;
  results$: Observable<any>;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.SearchForm = this.formBuilder.group({
      search: ['', Validators.required]
    });

    this.results$ = this.SearchForm.controls.search.valueChanges.pipe(
      filter(value => value.length > 3),
      distinctUntilChanged(),
      switchMap(query => this.httpClient.get<any>(`${API_URL}?q=${query}&cx=017576662512468239146:omuauf_lfve&key=${API_KEY}&part=snippet`)),
      debounceTime(600),
      map(response => response.items)
    );
  }
}