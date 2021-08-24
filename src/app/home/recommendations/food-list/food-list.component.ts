import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ShowAllFoods } from '@app/home/recommendations/recommendations.component';
import { switchMap } from 'rxjs/operators';
import { FoodService } from '@app/home/recommendations/food.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
})
export class FoodListComponent implements OnChanges {
  @ViewChild('paginatorFood') showAllPaginator: MatPaginator;
  @Input() showAllFoodsDataSource: MatTableDataSource<ShowAllFoods>;
  showFoodsColumns: string[] = ['image', 'name', 'type', 'editActions', 'actions'];

  foodType: string[] = ['VEGAN', 'VEGETARIAN', 'MEAT', 'DESSERT', 'SNACK'];
  editFoodForm: FormGroup;
  constructor(private foodService: FoodService, private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.editFoodForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
      recipe: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showAllFoodsDataSource) {
      this.showAllFoodsDataSource.paginator = this.showAllPaginator;
    }
  }
  deleteFood(id: string): void {
    this.foodService
      .deleteFood(id)
      .pipe(
        switchMap(() => {
          console.log('what?');
          return this.foodService.getFoods();
        })
      )
      .subscribe((res) => {
        this.showAllFoodsDataSource.data = res.body.data;
      });
  }
  editFood(data: any, content: any) {
    this.editFoodForm.patchValue({
      id: data.id,
      name: data.name,
      type: data.type,
      image: data.image,
      description: data.description,
      recipe: data.recipe,
    });
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
  }
  editFoodSubmit() {
    this.foodService
      .editFood({ ...this.editFoodForm.value, id: undefined }, this.editFoodForm.value.id)
      .subscribe(() => {
        this.foodService.getFoods().subscribe((res) => {
          this.showAllFoodsDataSource.data = res.body.data;
        });
      });
  }
}
