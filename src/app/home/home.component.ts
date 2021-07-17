import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { QuoteService } from './quote.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserData {
  name: string;
  phone: string;
  customerId: string;
  supervisor: string;
  program: string;
  timeRemaining: number;
}

export interface Message {
  from: string;
  text: string;
  createdAt: string;
  chatId: string;
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
  supervisors: string[] = ['one', 'two', 'three'];
  selectedSup = 'one';
  selectedProgram = 'one';
  numberOfCustomers = 0;
  numberOfActiveCustomers = 0;
  numberOfInactiveCustomers = 0;
  numberOfCompletedCustomers = 0;
  activeUsers: any;
  inactiveUsers: any;
  allUsers: any;
  selectedCustomer: any;
  currentUserMessages: any;
  selectedCustomerID: any;

  currentMoneyback: boolean = false;
  currentInsta: boolean = false;
  currentQuestions: boolean = false;
  currentSleepQuestions: boolean = false;
  currentFood: boolean = false;
  currentSleepDiagram: boolean = false;

  currentActiveTab = 'all';

  displayedColumns: string[] = ['name', 'phone', 'customerId', 'supervisor', 'program', 'timeRemaining', 'actions'];
  messageDisplayedColumns: string[] = ['from', 'text', 'timestamp'];
  dataSource: MatTableDataSource<UserData>;
  messageDataSource: MatTableDataSource<Message>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sendMessageForm: FormGroup;
  editCustomerForm: FormGroup;

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.getCustomers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.ngxLoader.start();
    this.sendMessageForm = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.editCustomerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      initialWeight: [0, [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

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
            this.numberOfCustomers = this.customerData.length;
            this.filterCustomerData(this.customerData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  currentActive(tabName: string) {
    switch (tabName) {
      case 'all':
        this.currentActiveTab = 'all';
        this.dataSource = this.allUsers;
        break;

      case 'active':
        this.currentActiveTab = 'active';
        this.dataSource = this.activeUsers;
        break;

      case 'inactive':
        this.currentActiveTab = 'inactive';
        this.dataSource = this.inactiveUsers;
        break;

      case 'completed':
        this.currentActiveTab = 'completed';
        break;
    }
  }

  viewCustomerDetails(content: any, customerId: string) {
    let selectedCustomerTemp = this.customerData.map((customer: any) => {
      if (customer.id === customerId) {
        return customer;
      }
    });

    let selectedCustomerTemp1 = selectedCustomerTemp.filter((user: any) => {
      return user !== undefined;
    });

    this.selectedCustomer = selectedCustomerTemp1[0];

    if (this.selectedCustomer.length !== 0) {
      this.currentMoneyback = this.selectedCustomer.moneyback;
      this.currentInsta = this.selectedCustomer.instagramFeed;
      this.currentQuestions = this.selectedCustomer.questions;
      this.currentSleepQuestions = this.selectedCustomer.sleepQuestions;
      this.currentFood = this.selectedCustomer.foodRecommendations;
      this.currentSleepDiagram = this.selectedCustomer.diagram;
    }

    this.modalService.open(content, { size: 'xl' });
  }

  editProfile(content: any, customerID: string) {
    this.selectedCustomerID = customerID;
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
  }

  sendMessage(content: any, chatId: any) {
    this.fetchMessages(chatId);
    this.modalService.open(content, { size: 'lg', backdropClass: 'light-blue-backdrop' });
  }

  sendTelegramMessage(e: any, id: any) {
    if (this.sendMessageForm.valid) {
      const data2Send = this.sendMessageForm.value;
      this.quoteService
        .sendTelegramMessage(data2Send, id)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Message sent!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.fetchMessages(this.selectedCustomer.telegramChatId);
              this.sendMessageForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  deleteCustomer(id: string) {
    console.log(id);
  }

  editCustomer(customerID: any) {
    if (this.editCustomerForm.valid) {
      const data2Send = this.editCustomerForm.value;
      this.quoteService
        .editCustomer(data2Send, customerID)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Customer details changed!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.getCustomers();
              this.modalService.dismissAll();
              this.editCustomerForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  fetchMessages(cID: any) {
    this.quoteService
      .getMessages(cID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this.filterMessages(res.body.data);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  filterMessages(data: any) {
    if (data !== undefined) {
      this.currentUserMessages = data.map((message: any) => {
        return {
          from: message.from,
          text: message.text,
          createdAt: message.createdAt,
          chatId: message.telegramChatId,
        };
      });

      this.messageDataSource = this.currentUserMessages;
    }
  }

  filterCustomerData(data: any) {
    if (data !== undefined) {
      this.allUsers = data.map((user: any) => {
        return {
          name: user.fullName,
          id: user.id,
          phone: user.phone,
          customerId: user.customerId,
          supervisor: user.supervisor,
          telegramName: user.telegramName,
          telegramChatId: user.telegramChatId,
          activeProgram: user.activeProgram,
          timeRemaining: user?.programRegistrationTimestamp
            ? Math.max(
                dayjs(user?.programRegistrationTimestamp).diff(dayjs(), 'days') + Number(user?.activeProgram?.duration),
                0
              ) || 'N/A'
            : 'N/A',
        };
      });

      let activeUserTemp = this.allUsers.map((user: any) => {
        if (user.activeProgram !== null) {
          return user;
        }
      });
      this.activeUsers = activeUserTemp.filter((user: any) => {
        return user !== undefined;
      });
      this.numberOfActiveCustomers = this.activeUsers.length;
      let inactiveUsersTemp = this.allUsers.map((user: any) => {
        if (user.activeProgram === null) {
          return user;
        }
      });
      this.inactiveUsers = inactiveUsersTemp.filter((user: any) => {
        return user !== undefined;

        // if (user !== undefined) {
        //   return {
        //     ...user,
        //     phone: user.telegramChatId,
        //     timeRemaining: user?.programRegistrationTimestamp
        //       ? Math.max(
        //         dayjs(user?.programRegistrationTimestamp).diff(dayjs(), 'days') + Number(user?.activeProgram?.duration),
        //         0
        //       ) || 'N/A'
        //       : 'N/A',
        //   }
        // }
      });
      this.numberOfInactiveCustomers = this.inactiveUsers.length;

      this.dataSource = this.allUsers;
    }
  }
}
