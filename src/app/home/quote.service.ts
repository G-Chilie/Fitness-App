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
  addNewEmployee: `${serverLink}/api/v1/employee`,
  addNewRecommendation: `${serverLink}/api/v1/recommendation`,
  telegram: `${serverLink}/api/v1/message`,
  sendTelegramMessage: `${serverLink}/api/v1/proxy/telegram/message/`,
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

  deleteRecommendation(id: string): Observable<any> {
    return this.httpClient
      .delete(endPoints.getRecommendations + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in deleting the recommendation.')
      );
  }

  deleteProgram(id: string): Observable<any> {
    return this.httpClient
      .delete(endPoints.getPrograms + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in deleting the program.')
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

  getMessages(id: any): Observable<any> {
    return this.httpClient
      .get(endPoints.telegram, {
        params: {
          'where[telegramChatId]': id,
          'order[createdAt]': 'desc',
        },
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

  addNewEmployee(data: any) {
    return this.httpClient
      .post(endPoints.addNewEmployee, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in adding new employee.')
      );
  }

  sendTelegramMessage(data: any, id: any) {
    return this.httpClient
      .post(endPoints.sendTelegramMessage + '/' + id, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error while sending message to telegram.')
      );
  }

  addRecommendation(data: any) {
    return this.httpClient
      .post(endPoints.addNewRecommendation, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in adding new recommendation.')
      );
  }

  addProgram(data: any) {
    return this.httpClient
      .post(endPoints.getPrograms, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in adding new program.')
      );
  }

  login(credentials: any): Observable<any> {
    return this.httpClient.post(endPoints.login, credentials).pipe(
      map((res: any) => {
        if (res.accessToken) {
          localStorage.setItem('userInfo', JSON.stringify(credentials));
          return res.accessToken;
        } else {
          console.log('error');
        }
      })
    );
  }
}
