import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private quoteService: QuoteService, private modalService: NgbModal, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isLoading = true;
  }

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

  newProfile(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  newEmployee(content: any) {
    this.modalService.open(content, { size: 'md' });
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
          ...profile,
        };
      });
      this.dataSource = profileTableData;
      this.isLoading = false;
    }
  }

  deleteEmp(id: string) {
    console.log(id);
    this.isLoading = true;

    this.quoteService
      .deleteEmployee(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this._snackBar.open(`User ${res.body.username} is ${res.body.status}`, '', {
              duration: 3000,
              verticalPosition: 'top',
            });
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
}
