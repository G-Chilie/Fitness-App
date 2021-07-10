import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from './authentication.service';
import { QuoteService } from '@app/home/quote.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('Login');

const authEndPoints = {
  login: 'https://diet.bodysperfect.com/api/v1/employee/login',
};

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  durationInSeconds = 5;
  tokenExpiry = 3600000;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private quoteService: QuoteService,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    // const Headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    // return this.httpClient
    //   .post(authEndPoints.login, this.loginForm.value)
    //   .pipe(
    //     map((res: any) => {
    //       console.log(res.accessToken);
    //       catchError(() => 'Error in logging in.');
    //     })
    //   );

    this.quoteService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          /* todo: if the api returns 403 unauthorized, do not let user sign in. just notify. */
          localStorage.setItem('token', res);
          this.authenticationService.autoLogOut(this.tokenExpiry);
          this.authenticationService.login(this.loginForm.value);
          this._snackBar.open('Login Successful.', '', { duration: 3000, verticalPosition: 'top' });
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          if (error.status === 404 || error.status === 401) {
            this._snackBar.open('Login failed. Check your credentials.', '', { duration: 3000 });
          }
        }
      );
    // this.isLoading = true;
    // const xx = this.authenticationService.login(this.loginForm.value);
    // console.log(xx);

    // const login$ = this.authenticationService.login(this.loginForm.value);
    // login$
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //       this.isLoading = false;
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe(
    //     (credentials) => {
    //       log.debug(`${credentials.username} successfully logged in`);
    //       this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
    //     },
    //     (error) => {
    //       log.debug(`Login error: ${error}`);
    //       this.error = error;
    //     }
    //   );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      // remember: true,
    });
  }
}
