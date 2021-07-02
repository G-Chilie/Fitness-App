import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';

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

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {}

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

  getPrograms() {
    this.isLoading = true;
    this.quoteService
      .getAllPrograms()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.programData = res.body.data;
            this.filterProgramData(this.programData);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
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
