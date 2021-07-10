import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

const authToken = sessionStorage.getItem('token');
const serverLink = 'https://diet.bodysperfect.com';
// const Headers = new HttpHeaders({
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${authToken}`,
// });

export interface RandomQuoteContext {
  category: string;
}

const endPoints = {
  getEmployees: `${serverLink}/api/v1/employee`,
  getPrograms: `${serverLink}/api/v1/program`,
  getRecommendations: `${serverLink}/api/v1/recommendation`,
  getCustomers: `${serverLink}/api/v1/customer?include=supervisor`,
  getMessages: `${serverLink}/api/v1/message`,
  login: `${serverLink}/api/v1/employee/login`,
  deleteEmployee: `${serverLink}/api/v1/employee`,
};

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private httpClient: HttpClient) {}

  getAllCustomers(): Observable<any> {
    return this.httpClient
      .get(endPoints.getCustomers, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in fetching customers.')
      );
  }

  getAllEmployees(): Observable<any> {
    return this.httpClient
      .get(endPoints.getEmployees, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in fetching employees.')
      );
  }

  deleteEmployee(id: string): Observable<any> {
    const bodyObj = { status: 'DEACTIVATED' };
    return this.httpClient
      .put(endPoints.deleteEmployee + '/' + id, bodyObj, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in deleting the user.')
      );
  }

  getAllPrograms(): Observable<any> {
    return this.httpClient
      .get(endPoints.getPrograms, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in fetching programs.')
      );
  }

  getAllRecommendations(): Observable<any> {
    return this.httpClient
      .get(endPoints.getRecommendations, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in fetching recommendations.')
      );
  }

  login(credentials: any): Observable<any> {
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
