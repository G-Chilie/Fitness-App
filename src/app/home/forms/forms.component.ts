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

export interface FormsData {
  id: string;
  name: string;
  questions: string;
  answers: string;
  createdAt: string;
  formowner: string;
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
  colDef: string[] = ['name', 'questions', 'answers', 'formowner', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<FormsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedFormID: any;
  addFormsForm: FormGroup;
  editFormsForm: FormGroup;
  activeAnswer: 'TestAnswer1';
  answers: string[] = ['TestAnswer1', 'TestAnswer2', 'TestAnswer3'];

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
      questions: ['', [Validators.required]],
      answers: ['', [Validators.required]],
    });
    if (localStorage.getItem('userStatus') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  ngAfterViewInit() {
    // this.getForms();
    this.formsData = [
      {
        id: 1,
        name: 'testname1',
        questions: 'testquestions1',
        answers: 'testanswers1',
        formowner: 'formowner',
        createdAt: '2021-08-12',
      },
      {
        id: 2,
        name: 'testname2',
        questions: 'testquestions2',
        answers: 'testanswers2',
        formowner: 'formowner',
        createdAt: '2021-08-12',
      },
      {
        id: 3,
        name: 'testname3',
        questions: 'testquestions3',
        answers: 'testanswers3',
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
    if (this.addFormsForm.valid) {
      const data2Send = {
        name: this.addFormsForm.value.name,
        questions: this.addFormsForm.value.questions,
        answers: this.addFormsForm.value.answers,
      };
      this.quoteService
        .addForm(data2Send)
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

  addQuestion() {}

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
          createdAt: form.createdAt,
        };
      });
      this.dataSource = formTableData;
    }
  }
}
