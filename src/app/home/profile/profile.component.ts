import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';

export interface Profile {
  username: string;
  status: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'status', 'actions'];
  isLoading = false;
  profileData: any;
  dataSource: MatTableDataSource<Profile>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.getProfiles();
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProfiles() {
    this.isLoading = true;
    this.quoteService
      .getAllEmployees()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.profileData = res.body.data;
            this.filterProfileData(this.profileData);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  filterProfileData(data: any) {
    if (data !== undefined) {
      let profileTableData = data.map((profile: any) => {
        return {
          username: profile.username,
          status: profile.status,
        };
      });
      this.dataSource = profileTableData;
    }
  }
}
