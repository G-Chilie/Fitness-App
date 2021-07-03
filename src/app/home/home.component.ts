import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { QuoteService } from './quote.service';

export interface UserData {
  name: string;
  phone: string;
  customerId: string;
  supervisor: string;
  program: string;
  timeRemaining: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  quote: string | undefined;
  isLoading = false;
  customerData: any;

  displayedColumns: string[] = ['name', 'phone', 'customerId', 'supervisor', 'program', 'timeRemaining', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private quoteService: QuoteService) {}

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.getCustomers();
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {}

  getCustomers() {
    this.isLoading = true;
    this.quoteService
      .getAllCustomers()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.customerData = res.body.data;
            this.filterCustomerData(this.customerData);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  filterCustomerData(data: any) {
    if (data !== undefined) {
      let userTableData = data.map((user: any) => {
        return {
          name: user.fullName,
          phone: user.telegramChatId,
          customerId: user.customerId,
          supervisor: 'helie',
          program: 'test program',
          timeRemaining: 1,
        };
      });
      this.dataSource = userTableData;
    }
  }
}
