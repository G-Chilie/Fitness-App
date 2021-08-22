import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUserRest } from '@shared/interfaces/user.interface';
import { environment } from '@env/environment';
import { CusSearchResObject, Datum } from './home';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  category: string;
}

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  telegramChatId: number;
  telegramMessageId: number;
  isQuestion: boolean;
  from: string;
  mimeType: null;
  fileIds: null;
}

const endPoints = {
  getEmployees: '/api/v1/employee?&limit=999',
  getEmployee: '/api/v1/employee/',
  getPrograms: '/api/v1/program',

  getForms: '/api/v1/questionnaire',

  getCustomers:
    '/api/v1/customer?include=supervisor&inlclude=programHistory&include=question&include=programHistory&limit=100',
  getMessages: '/api/v1/message',
  login: '/api/v1/employee/login',
  deleteEmployee: '/api/v1/employee/',
  addNewEmployee: '/api/v1/employee',
  telegram: '/api/v1/message',
  sendTelegramMessage: '/api/v1/proxy/telegram/message/',
  editCustomer: '/api/v1/customer/',
  editEmployee: '/api/v1/employee/',
  editForm: '/api/v1/form',
  getSupervisors: '/api/v1/employee?where[status]=ACTIVATED&limit=999',
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

  editCustomer(data: any, customerID: string) {
    return this.httpClient
      .put(endPoints.editCustomer + customerID, data, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in editing the customer.')
      );
  }

  changePassword(data: any, customerID: string) {
    return this.httpClient
      .put(endPoints.editEmployee + customerID, data, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in updating the password.')
      );
  }

  editEmployee(data: any, employeeID: string) {
    return this.httpClient
      .put(endPoints.editEmployee + employeeID, data, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in editing the employee.')
      );
  }

  editForm(data: any, formID: string) {
    return this.httpClient
      .put(endPoints.editForm + formID, data, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in editing the form.')
      );
  }

  getAllEmployees(): Observable<IUserRest[]> {
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

  getEmployee(empId: string) {
    return this.httpClient
      .get(endPoints.getEmployee + empId, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in fetching employee.')
      );
  }
  // -----------------------------------------------------------------START-CUSTOMER-SEARCH-FORM-------------------------------------------------

  getCustomerBySearch(): Observable<any> {
    const PATH = `${environment.serverUrl}/api/v1/customer`;
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      Authorization:
        'Bearer' +
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY2YWM2ZWZiLTg2YzgtNDU2My1iZTIyLWMyMjU0OTQyNDlkZCIsInVzZXJuYW1lIjoibGFsb28iLCJ1c2VyU3RhdHVzIjoiQURNSU4iLCJpYXQiOjE2MjkxMzQ5NzUsImV4cCI6MTYyOTEzODU3NX0.4D1Np-PSPmdLIgVrghvPBrEV9W9PF3KejwVjD8GK5JI',
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.httpClient.get<CusSearchResObject>(PATH, requestOptions);
  }

  // -----------------------------------------------------------------END-CUSTOMER-SEARCH-FORM-------------------------------------------------

  getSupervisors(): Observable<any> {
    return this.httpClient
      .get(endPoints.getSupervisors, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in fetching supervisors.')
      );
  }

  deleteEmployee(id: string): Observable<any> {
    const bodyObj = { status: 'DEACTIVATED' };
    return this.httpClient
      .put(endPoints.deleteEmployee + id, bodyObj, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in deleting the user.')
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

  deleteForm(id: string): Observable<any> {
    return this.httpClient
      .delete(endPoints.getForms + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'Error in deleting the form.')
      );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.httpClient
      .delete(endPoints.editCustomer + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => 'e')
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

  getAllForms(): Observable<any> {
    return this.httpClient
      .get(endPoints.getForms, {
        params: {
          include: 'employee',
          limit: '999',
        },
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in fetching forms.')
      );
  }

  getMessages(id: any, page: any = 1): Observable<any> {
    return this.httpClient
      .get(endPoints.telegram, {
        params: {
          'where[telegramChatId]': id,
          'order[createdAt]': 'desc',
          limit: '100',
          page: page,
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

  addForm(data: any) {
    return this.httpClient
      .post(endPoints.getForms, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in adding new form.')
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

  registerEmployee(data: any) {
    console.log('inservice', data);
    return this.httpClient
      .post(endPoints.addNewEmployee, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in registration process.')
      );
  }
}
