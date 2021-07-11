import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface ProgramData {
  name: string;
  productId: string;
  questions: boolean;
  moneyback: boolean;
  recommendations: boolean;
  duration: string;
}

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
})
export class ProgramComponent implements OnInit, AfterViewInit {
  isLoading = false;
  programData: any;
  colDef: string[] = ['name', 'productId', 'questions', 'moneyback', 'recommendations', 'duration'];
  dataSource: MatTableDataSource<ProgramData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getPrograms();
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newProgram(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  getPrograms() {
    this.ngxLoader.start();
    this.quoteService
      .getAllPrograms()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.programData = res.body.data;
            this.filterProgramData(this.programData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  filterProgramData(data: any) {
    if (data !== undefined) {
      let programTableData = data.map((program: any) => {
        return {
          name: program.name,
          // productId: [...program.productIds],
          productId: program.productIds[0],
          questions: program.question,
          moneyback: program.moneyback,
          recommendations: program.foodRecommendations,
          duration: 1,
        };
      });
      this.dataSource = programTableData;
    }
  }
}
