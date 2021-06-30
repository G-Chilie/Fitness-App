import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

const endPoints = {
  getEmployees: '/api/v1/employee',
  getPrograms: '/api/v1/program',
  getRecommendations: '/api/v1/recommendation',
  getCustomers: 'https://diet.bodysperfect.com/api/v1/customer',
  getMessages: '/api/v1/message',
};

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private httpClient: HttpClient) {}

  // getRandomQuote(context: RandomQuoteContext): Observable<string> {
  //   return this.httpClient.get(routes.quote(context)).pipe(
  //     map((body: any) => body.value),
  //     catchError(() => of('Error, could not load joke :-('))
  //   );
  // }

  /*
  TODO: create a httpHeaders interceptor so that we don't have a add headers in each request 
   */

  getAllCustomers(auth_token: any): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return this.httpClient
      .get(endPoints.getCustomers, {
        headers: Headers,
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          catchError(() => 'Error in fetching customers.');
        })
      );
  }

  getAllEmployees(auth_token: any): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return this.httpClient
      .get(endPoints.getEmployees, {
        headers: Headers,
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          catchError(() => 'Error in fetching employees.');
        })
      );
  }
}
