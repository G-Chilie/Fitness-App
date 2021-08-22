import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccountStatus } from '@shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public get isUserAdmin(): boolean {
    return localStorage.getItem('userStatus') === AccountStatus.Admin;
  }
  constructor() {}
}
