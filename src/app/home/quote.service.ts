import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

const authToken = sessionStorage.getItem('token');
const serverLink = 'https://diet.bodysperfect.com';

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

const endPoints = {
  getEmployees: `${serverLink}/api/v1/employee`,
  getPrograms: `${serverLink}/api/v1/program`,
  getRecommendations: `${serverLink}/api/v1/recommendation`,
  getCustomers: `${serverLink}/api/v1/customer`,
  getMessages: `${serverLink}/api/v1/message`,
  login: `${serverLink}/api/v1/employee/login`,
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

  getAllCustomers(): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
    return this.httpClient
      .get(endPoints.getCustomers, {
        headers: Headers,
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
          catchError(() => 'Error in fetching customers.');
        })
      );
  }

  getAllEmployees(): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
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

  getAllPrograms(): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
    return this.httpClient
      .get(endPoints.getPrograms, {
        headers: Headers,
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
          catchError(() => 'Error in fetching progeams.');
        })
      );
  }

  login(credentials: any): Observable<any> {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(endPoints.login, credentials).pipe(
      map((res: any) => {
        if (res.accessToken) {
          return res.accessToken;
        } else {
          console.log('error');
        }
      })
    );
  }
}
