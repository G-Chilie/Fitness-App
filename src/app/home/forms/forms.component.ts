import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// declare var jQuery: any;

// function addQuestion() {
//   var html = '';
//   html =  '<div fxLayout="row" fxLayoutAlign="start center" >' +
//   '<mat-form-field class="example-full-width w-100 mt-2 cus-padding" appearance="outline">' +
//     '<mat-label>Questions</mat-label>' +
//     '<input matInput placeholder="questions" formControlName="questions" name="questions" autocomplete="off" class="width-80"/>' +
//     '<mat-error *ngIf="addFormsForm.get(\'questions\')?.hasError(\'required\')"> Questions is Required! </mat-error>' +
//   '</mat-form-field>' +
//   '<button type="button" (click)="addQuestion()" class="btn btn-light cus-button">' +
//     '<mat-icon>add_circle_outline</mat-icon>' +
//   '</button>'+
// '</div>'+
// '<div fxLayout="row" fxLayoutAlign="start center">' +
//   '<mat-label class="custom-label">Answers :</mat-label>'+
//   '<mat-form-field appearance="outline" class="w-90 mt-2">'+
//     '<mat-select formControlName="answer">'+
//       '<mat-option *ngFor="let answer of answers" value={{ answer }}>'+
//         '{{ answer }}'+
//       '</mat-option>'+
//     '</mat-select>'+
//     '<mat-error *ngIf="addFormsForm.get(\'answer\')?.hasError(\'required\')"> Answers is Required! </mat-error>'+
//   '</mat-form-field>'+
// '</div>';
//   (function ($) {
//     $(".add-quesitons").after(html);
//   })(jQuery);
// }

export type statusActive = 'ACTIVE';
export type statusOnRegistration = 'ON_REGISTRATION';
export type statusInactive = 'INACTIVE';
export type optionInput = 'input';
export type optionButton = 'button';

export interface QuestionData {
  question: string;
  constraint: string;
  answerOptions: optionInput | optionButton;
  buttons?: string[];
}

export interface FormsData {
  id: string;
  name: string;
  questions: QuestionData[];
  createdAt: string;
  formowner: string;
  status: statusActive | statusOnRegistration | statusInactive;
}

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit, AfterViewInit {
  isLoading = false;
  formsData: any;
  isAdmin: boolean;
  colDef: string[] = ['name', 'formowner', 'status', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<FormsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedFormID: any;
  addFormsForm: FormGroup;
  editFormsForm: FormGroup;
  answers: string[] = ['Button', 'Input'];
  constraints: string[] = ['isWeight', 'isFood', 'isSleep', 'isHeight', 'isString', 'isDob'];
  status: string[] = ['ACTIVE', 'ON_REGISTRATION', 'INACTIVE'];
  containers: number[][] = [[1]];

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    this.addFormsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      questions0: ['', [Validators.required]],
      answers0: ['', [Validators.required]],
      constraints0: ['', [Validators.required]],
      buttonGroup0: this.formBuilder.group({
        button0: ['', [Validators.required]],
      }),
    });
    console.log(this.addFormsForm.controls);
    if (localStorage.getItem('userStatus') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    // this.containers.push(1);
  }
  print(a: any) {
    console.log(JSON.stringify(a));
  }
  ngAfterViewInit() {
    // this.getForms();
    this.formsData = [
      {
        id: 1,
        name: 'testname1',
        status: 'on_reg',
        formowner: 'formowner',
        createdAt: '2021-08-12',
      },
      {
        id: 2,
        name: 'testname2',
        status: 'active',
        formowner: 'formowner',
        createdAt: '2021-08-12',
      },
      {
        id: 3,
        name: 'testname3',
        status: 'inactive',
        formowner: 'formowner',
        createdAt: '2021-08-12',
      },
    ];

    this.filterFormsData(this.formsData);
    this.ngxLoader.stop();
  }

  newForm(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  getForms() {
    this.ngxLoader.start();
    this.quoteService
      .getAllForms()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.formsData = res.body.data;
            this.filterFormsData(this.formsData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  addForm(e: any) {
    this.ngxLoader.start();
    const rawValues = this.addFormsForm.value;
    let formValid: boolean = true;
    for (const [key, value] of Object.entries(rawValues)) {
      if (key.includes('buttonGroup')) {
        let index = key[key.length - 1];
        if (rawValues['answers' + index].toLowerCase() === 'button') {
          formValid = rawValues[key].valid;
        }
      }
    }

    if (formValid) {
      console.log(rawValues);
      let questionArray: QuestionData[] = [];
      for (const [key, value] of Object.entries(rawValues)) {
        if (key.includes('question')) {
          let index = key[key.length - 1];
          let question: QuestionData = {
            question: rawValues['questions' + index],
            answerOptions: rawValues['answers' + index]?.toLowerCase(),
            constraint: rawValues['constraints' + index],
          };
          question.constraint = question.answerOptions === 'button' ? 'isString' : question.constraint;
          questionArray.push(question);
        }
      }

      let formData = {
        name: rawValues['name'],
        questions: questionArray,
        status: rawValues['status'],
      };
      console.log(JSON.stringify(formData));
      this.quoteService
        .addForm(JSON.stringify(formData))
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Program has been added!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.modalService.dismissAll();
              this.addFormsForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  deleteForm(id: string) {
    this.ngxLoader.start();
    this.quoteService
      .deleteForm(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this._snackBar.open(`Form deleted!`, '', {
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

  editForm(content: any, data: any) {
    this.selectedFormID = data.id;
    this.editFormsForm.patchValue({
      name: data.name ? data.name : '',
      questions: data.questions ? data.questions : null,
      answers: data.answers ? data.answers : null,
    });
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
  }

  addQuestion() {
    console.log(this.addFormsForm.value);
    this.addFormsForm.addControl('questions' + this.containers.length, new FormControl('', Validators.required));
    this.addFormsForm.addControl('answers' + this.containers.length, new FormControl('', Validators.required));
    this.addFormsForm.addControl('constraints' + this.containers.length, new FormControl('', Validators.required));
    this.addButton(this.containers.push([1]) - 1);
  }

  addButton(index: number) {
    console.log(index);
    let buttonGroup: FormGroup = this.addFormsForm.get('buttonGroup' + index) as FormGroup;
    if (!buttonGroup) {
      this.addFormsForm.addControl(
        'buttonGroup' + index,
        this.formBuilder.group({
          button0: ['', [Validators.required]],
        })
      );
      return;
    }
    buttonGroup.addControl('button' + this.containers[index].length, new FormControl('', Validators.required));
    this.containers[index].push(this.containers[index].length);
  }

  patchForm(id: any) {
    if (this.editFormsForm.valid) {
      const data2Send = this.editFormsForm.value;
      this.quoteService
        .editForm(data2Send, id)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this._snackBar.open(`Employee details updated!`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
              this.getForms();
              this.modalService.dismissAll();
              this.editFormsForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  compareAnswer(st1: any, st2: any) {
    return st1 && st2 && st1 === st2;
  }

  filterFormsData(data: any) {
    if (data !== undefined) {
      let formTableData = data.map((form: any) => {
        return {
          id: form.id,
          name: form.name,
          questions: form.questions,
          answers: form.answers,
          formowner: form.formowner,
          status: form.status,
          createdAt: form.createdAt,
        };
      });
      this.dataSource = formTableData;
    }
  }
}
