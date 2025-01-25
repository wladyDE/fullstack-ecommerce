import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {
  private baseUrl = environment.luv2shopApiUrl

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/countries`

    return this.httpClient.get<Country[]>(url);
  }

  getStates(code: string): Observable<State[]> {
    const url = `${this.baseUrl}/states?code=${code}`

    return this.httpClient.get<State[]>(url);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = []

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth)
    }

    return of(data)
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = []

    const startYear: number = new Date().getFullYear()
    const endYear: number = startYear + 10

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear)
    }

    return of(data)
  }
}
