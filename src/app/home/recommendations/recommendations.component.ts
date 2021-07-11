import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface Recommendations {
  type: string;
  description: string;
}

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'description', 'actions'];
  isLoading = false;
  recommendationData: any;
  dataSource: MatTableDataSource<Recommendations>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  recommendations: string[] = ['Food', 'Cardio', 'Diet'];
  selectedRec = 'Food';

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.getRecommendations();
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newRecommendation(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  getRecommendations() {
    this.ngxLoader.start();
    this.quoteService
      .getAllRecommendations()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.recommendationData = res.body.data;
            this.filterRecommendationData(this.recommendationData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  filterRecommendationData(data: any) {
    if (data !== undefined) {
      let recommendationTableData = data.map((rec: any) => {
        return {
          type: rec.type,
          description: rec.description,
        };
      });

      this.dataSource = recommendationTableData;

      this.ngxLoader.stop();
    }
  }
}
