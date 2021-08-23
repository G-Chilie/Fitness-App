import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const endpoints = {
  program: '/api/v1/program',
};

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  constructor(private httpClient: HttpClient) {}
  addProgram(data: any) {
    return this.httpClient
      .post(endpoints.program, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in adding new program.');
          return EMPTY;
        })
      );
  }
  getProgram(): Observable<any> {
    return this.httpClient
      .get(endpoints.program, {
        observe: 'response',
        params: { limit: '999', include: 'employee' },
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in fetching programs.');
          return EMPTY;
        })
      );
  }
  deleteProgram(id: string): Observable<any> {
    return this.httpClient
      .delete(endpoints.program + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => {
          console.error('Error in deleting the program.');
          return EMPTY;
        })
      );
  }
  editProgram(data: any, id: string) {
    return this.httpClient
      .put(endpoints.program + `/` + id, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in editing program.');
          return EMPTY;
        })
      );
  }
}
