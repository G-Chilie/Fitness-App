import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const endpoints = {
  recommendation: '/api/v1/recommendation',
};

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  constructor(private httpClient: HttpClient) {}
  addRecommendation(data: any) {
    return this.httpClient
      .post(endpoints.recommendation, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in adding new recommendation.');
          return EMPTY;
        })
      );
  }
  getRecommendation(): Observable<any> {
    return this.httpClient
      .get(endpoints.recommendation, {
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
  deleteRecommendation(id: string): Observable<any> {
    return this.httpClient
      .delete(endpoints.recommendation + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => {
          console.error('Error in deleting the recommendation.');
          return EMPTY;
        })
      );
  }
  editRecommendation(data: any, id: string) {
    return this.httpClient
      .put(endpoints.recommendation + `/` + id, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in adding new form.');
          return EMPTY;
        })
      );
  }
}
