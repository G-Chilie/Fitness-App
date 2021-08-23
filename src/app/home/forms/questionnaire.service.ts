import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const endpoints = {
  questionnaire: '/api/v1/questionnaire',
};

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private httpClient: HttpClient) {}
  addQuestionnaire(data: any) {
    return this.httpClient
      .post(endpoints.questionnaire, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in adding new questionnaire.');
          return EMPTY;
        })
      );
  }
  getQuestionnaire(): Observable<any> {
    return this.httpClient
      .get(endpoints.questionnaire, {
        observe: 'response',
        params: { limit: '999', include: 'employee' },
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in fetching questionnaires.');
          return EMPTY;
        })
      );
  }
  deleteQuestionnaire(id: string): Observable<any> {
    return this.httpClient
      .delete(endpoints.questionnaire + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => {
          console.error('Error in deleting the questionnaire.');
          return EMPTY;
        })
      );
  }
  editQuestionnaire(data: any, id: string) {
    return this.httpClient
      .put(endpoints.questionnaire + `/` + id, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in editing questionnaire.');
          return EMPTY;
        })
      );
  }
}
