import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ShowAllFoods } from '@app/home/recommendations/recommendations.component';
import { QuoteService } from '@app/home/quote.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
})
export class FoodListComponent implements OnChanges {
  @ViewChild('paginatorFood') showAllPaginator: MatPaginator;
  @Input() showAllFoodsDataSource: MatTableDataSource<ShowAllFoods>;
  showFoodsColumns: string[] = ['image', 'name', 'type', 'editActions', 'actions'];
  constructor(private quoteService: QuoteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showAllFoodsDataSource) {
      this.showAllFoodsDataSource.paginator = this.showAllPaginator;
    }
  }
  deleteFood(id: string): void {
    this.quoteService
      .deleteFood(id)
      .pipe(
        switchMap(() => {
          console.log('what?');
          return this.quoteService.getRecommendation();
        })
      )
      .subscribe((res) => {
        this.showAllFoodsDataSource.data = res.body.data;
      });
  }
  editFood(data: any) {}
}
