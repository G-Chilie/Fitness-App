import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface Recommendations {
  type: string;
  description: string;
}

export interface ShowAllFoods {
  name: string;
  image: string;
  type: string;
}

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['image', 'name', 'description', 'actions'];
  showFoodsColumns: string[] = ['image', 'name', 'type'];
  isLoading = false;
  recommendationData: any;
  dataSource: MatTableDataSource<Recommendations>;
  showAllFoodsDataSource: MatTableDataSource<ShowAllFoods>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  foodType: string[] = ['VEGAN', 'VEGETARIAN', 'MEAT', 'DESSERT', 'SNACK'];
  selectedType = 'Vegan';
  addRecForm: FormGroup;
  addFoodForm: FormGroup;
  recommendationsList: any = [];
  listToPopulate: any = [];
  selectedRec = 'Food';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedRecommendation: any = [];
  selectable = true;
  removable = true;
  recommendations: any = [];

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    this.addRecForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      recommendationCtrl: ['', [Validators.required]],
    });
    this.addFoodForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
      recipe: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getRecommendationsList();
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
    this.getFoodRecommendation();
  }

  showAllFoods(content: any) {
    this.modalService.open(content, { size: 'md' });
    this.ngxLoader.start();
    this.quoteService
      .getRecommendation()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.showAllFoodsDataSource = res.body.data;
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  getFoodRecommendation() {
    this.ngxLoader.start();
    this.quoteService
      .getRecommendation()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.recommendationsList = res.body.data;
            this.selectedRecommendation = [...this.recommendationsList];
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  getRecommendationsList() {
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

  saveRecommendation(e: any) {
    this.ngxLoader.start();
    let recommendationTemp = this.recommendations.map((item: any) => item.id);
    if (this.addRecForm.valid) {
      const data2Send = {
        name: this.addRecForm.controls.name.value,
        image: this.addRecForm.controls.image.value,
        type: this.addRecForm.controls.foodType.value,
        description: this.addRecForm.controls.description.value,
        recommendations: recommendationTemp,
      };
      this.quoteService
        .saveRecommendations(data2Send)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Recommendation had been added!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.modalService.dismissAll();
              this.addRecForm.reset();
              this.getRecommendationsList();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  addFood(e: any) {
    this.ngxLoader.start();
    if (this.addFoodForm.valid) {
      const data2Send = this.addFoodForm.value;
      this.quoteService
        .addFood(data2Send)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Food has been added!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.modalService.dismissAll();
              this.addRecForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  deleteRecommendation(id: string) {
    this.ngxLoader.start();
    this.quoteService
      .deleteRecommendation(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this._snackBar.open(`Recommendation deleted!`, '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
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
      this.dataSource = new MatTableDataSource<Recommendations>(
        data.map((rec: any) => {
          return {
            name: rec.name,
            image: rec.image,
            description: rec.description,
            id: rec.id,
          };
        })
      );
      setTimeout(() => (this.dataSource.paginator = this.paginator));

      this.ngxLoader.stop();
    }
  }

  remove(rec: any): void {
    const removeIndex = this.listToPopulate.findIndex((item: any) => item.id === rec.id);

    if (removeIndex >= 0) {
      this.listToPopulate.splice(removeIndex, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.listToPopulate.push(event.option.viewValue);
    this.listToPopulate.push(this.addRecForm.controls.recommendationCtrl.value);
    this.recommendations.push(this.addRecForm.controls.recommendationCtrl.value);
  }

  addNewFood(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  addFoodFormSubmit(e: any) {
    this.ngxLoader.start();
    if (this.addFoodForm.valid) {
      const data2Send = this.addFoodForm.value;
      this.quoteService
        .addFood(data2Send)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Food had been added!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.modalService.dismissAll();
              this.addFoodForm.reset();
            }

            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }
}
