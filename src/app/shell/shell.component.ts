import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuoteService } from '../home/quote.service';
import { finalize } from 'rxjs/operators';

import { AuthenticationService, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  isAdmin: boolean;
  changePasswordForm: FormGroup;
  changeEmailForm: FormGroup;
  constructor(
    private router: Router,
    private quoteService: QuoteService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService
  ) {}

  userName = '';
  isLoading: boolean;
  employeeData: any;
  employeeId: string;

  ngOnInit() {
    let userinfo = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(userinfo);
    this.userName = userInfo.username;
    if (localStorage.getItem('userStatus') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]],
    });

    this.changeEmailForm = this.formBuilder.group({
      newEmail: ['', [Validators.required]],
      confirmNewEmail: ['', [Validators.required]],
    });

    this.employeeId = localStorage.getItem('uuid');
    this.getEmployeeDetails();
  }

  openEditModal(content: any) {
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
  }

  getEmployeeDetails() {
    this.isLoading = true;
    this.quoteService
      .getEmployee(this.employeeId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this.employeeData = res.body;
          }
          this.ngxLoader.stop();
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  employeeProfile(content: any) {
    this.modalService.open(content, { size: 'lg', backdropClass: 'light-blue-backdrop' });
  }

  updatePassword() {
    const userId = localStorage.getItem('uuid');
    this.ngxLoader.start();
    this.modalService.dismissAll();
    if (this.changePasswordForm.valid) {
      const data2Send = {
        password: this.changePasswordForm.controls.newPassword.value,
      };
      this.quoteService
        .changePassword(data2Send, userId)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Password Updated!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });

              this.changePasswordForm.reset();
            }

            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  updateEmail() {
    const userId = localStorage.getItem('uuid');
    this.ngxLoader.start();
    this.modalService.dismissAll();
    if (this.changeEmailForm.valid) {
      const data2Send = {
        email: this.changeEmailForm.controls.newEmail.value,
      };
      this.quoteService
        .changePassword(data2Send, userId)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Password Updated!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });

              this.changeEmailForm.reset();
            }

            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
    this._snackBar.open('You have successfully logged out!', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar'],
    });
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
