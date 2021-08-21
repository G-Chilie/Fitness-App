import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const endpoints = {
  food: '/api/v1/food',
};

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private httpClient: HttpClient) {}

  getFoods(): Observable<any> {
    return this.httpClient
      .get(endpoints.food, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => {
          console.error('Error in fetching foods.');
          return EMPTY;
        })
      );
  }
  editFood(data: any, id: string) {
    return this.httpClient
      .put(endpoints.food + id, data, {
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

  addFood(data: any) {
    return this.httpClient
      .post(endpoints.food, data, {
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(() => 'Error in adding new recommendation.')
      );
  }

  deleteFood(id: string): Observable<any> {
    return this.httpClient
      .delete(endpoints.food + '/' + id, {
        observe: 'response',
      })
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError(() => {
          console.error('Error in deleting the food.');
          return EMPTY;
        })
      );
  }
}
