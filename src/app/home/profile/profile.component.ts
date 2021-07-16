import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  statuses: string[] = ['ADMIN', 'ACTIVATED', 'DEACTIVATED'];
  isLoading = false;
  profileData: any;
  dataSource: MatTableDataSource<Profile>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  username: any;
  newEmployeeForm: FormGroup;

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    this.newEmployeeForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[a-zA-Z]+')],
      ],
      password: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getProfiles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // newProfile(content: any) {
  //   this.modalService.open(content, { size: 'md' });
  // }

  newEmployee(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  getProfiles() {
    this.ngxLoader.start();
    this.quoteService
      .getAllEmployees()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.profileData = res.body.data;
            this.filterProfileData(this.profileData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  addEmployee(e: any) {
    this.ngxLoader.start();
    if (this.newEmployeeForm.valid) {
      const data2Send = this.newEmployeeForm.value;
      this.quoteService
        .addNewEmployee(data2Send)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Employee had been added!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.modalService.dismissAll();
              this.newEmployeeForm.reset();
            }

            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  filterProfileData(data: any) {
    if (data !== undefined) {
      let profileTableData = data.map((profile: any) => {
        return {
          ...profile,
        };
      });
      this.dataSource = profileTableData;

      this.ngxLoader.stop();
    }
  }

  deleteEmp(id: string) {
    this.ngxLoader.start();
    this.quoteService
      .deleteEmployee(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this._snackBar.open(`User ${res.body.username} is ${res.body.status}`, '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
          }
          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  editEmployee(id: string) {
    console.log(id);
  }
}
