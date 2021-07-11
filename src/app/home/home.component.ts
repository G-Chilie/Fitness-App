import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { QuoteService } from './quote.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare const Plotly: any;

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
  supervisors: string[] = ['one', 'two', 'three'];
  selectedSup = 'one';
  selectedProgram = 'one';
  numberOfCustomers = '0';
  numberOfActiveCustomers = '0';

  currentActiveTab = 'all';

  displayedColumns: string[] = ['name', 'phone', 'customerId', 'supervisor', 'program', 'timeRemaining', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getCustomers();
    }, 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.ngxLoader.start();
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
            console.log('xcustomerData', this.customerData);
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
        break;

      case 'active':
        this.currentActiveTab = 'active';
        break;

      case 'inactive':
        this.currentActiveTab = 'inactive';
        break;

      case 'completed':
        this.currentActiveTab = 'completed';
        break;
    }
  }

  viewCustomerDetails(content: any, customerId: string) {
    this.modalService.open(content, { size: 'xl' });
    setTimeout(() => {
      const that = this;
      const layoutdiv = document.getElementById('plot-chart');
      const chartConfig = { displayModeBar: false };
      const layout = {
        showlegend: true,
        legend: {
          orientation: 'h',
          x: 0.4,
          y: 1.4,
        },
        autosize: false,
        width: 500,
        height: 280,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4,
        },
        // paper_bgcolor: '#7f7f7f',
        // plot_bgcolor: '#c7c7c7'
      };
      var trace = {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        type: 'scatter',
        name: 'amount',
      };

      let data = [trace];
      Plotly.newPlot(layoutdiv, data, layout, chartConfig);
    }, 2000);
  }

  editProfile(content: any) {
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
  }

  deleteCustomer(id: string) {
    console.log(id);
  }

  editCustomer(id: string) {
    console.log(id);
  }

  filterCustomerData(data: any) {
    if (data !== undefined) {
      let userTableData = data.map((user: any) => {
        return {
          name: user.fullName,
          id: user.id,
          phone: user.telegramChatId,
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
      this.dataSource = userTableData;
    }
  }
}
