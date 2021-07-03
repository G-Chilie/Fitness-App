import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';

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

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {}

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

  getRecommendations() {
    this.isLoading = true;
    this.quoteService
      .getAllRecommendations()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.recommendationData = res.body.data;
            this.filterRecommendationData(this.recommendationData);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
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
    }
  }
}
