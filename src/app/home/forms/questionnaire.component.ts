import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteService } from '../quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalService } from '@core/global.service';
import { QuestionnaireService } from '@app/home/forms/questionnaire.service';

export type statusActive = 'ACTIVE';
export type statusOnRegistration = 'ON_REGISTRATION';
export type statusInactive = 'INACTIVE';
export type optionInput = 'input';
export type optionButton = 'button';

export interface QuestionData {
  question: string;
  constraint: string;
  answerOptions: optionInput | optionButton | string[];
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
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit, AfterViewInit {
  isLoading = false;
  QuestionnaireData: any;
  colDef: string[];
  dataSource: MatTableDataSource<FormsData>;
  @ViewChild('questionnairePaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedQuestionnaireID: any;
  addQuestionnaireForm: FormGroup;
  editQuestionnaireForm: FormGroup;
  questionnaires: any = [];
  answers: string[] = ['Button', 'Input'];
  constraints: string[] = ['isWeight', 'isFood', 'isSleep', 'isHeight', 'isString', 'isDob'];
  status: string[] = ['ACTIVE', 'ON_REGISTRATION', 'INACTIVE'];
  listToPopulate: any = [];

  containers: number[][] = [[1]];

  constructor(
    private questionnaireervice: QuestionnaireService,
    private quoteService: QuoteService,
    public globalService: GlobalService,
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.colDef = [];
    this.colDef.push('name');
    if (this.globalService.isUserAdmin) {
      this.colDef.push('formowner');
    }
    this.colDef.push('status', 'createdAt', 'actions');
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.addQuestionnaireForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      questions0: ['', [Validators.required]],
      answers0: ['', [Validators.required]],
      constraints0: ['', [Validators.required]],
      buttonGroup0: this.formBuilder.group({
        button0: ['', [Validators.required]],
      }),
    });

    this.editQuestionnaireForm = this.formBuilder.group({
      name: [''],
      status: [''],
    });
  }

  print(a: any) {
    console.log(JSON.stringify(a));
  }

  ngAfterViewInit() {
    this.getQuestionnaires();
  }

  newQuestionnaire(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  getQuestionnaires() {
    this.ngxLoader.start();
    this.quoteService
      .getAllQuestionnaire()
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body.data) {
            this.QuestionnaireData = res.body.data;
            this.filterQuestionnaireData(this.QuestionnaireData);
          }

          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
        }
      );
  }

  addQuestionnaire(e: any) {
    this.ngxLoader.start();
    const rawValues = this.addQuestionnaireForm.value;
    let questionnaireValid = true;
    for (const [key, value] of Object.entries(rawValues)) {
      if (key.includes('buttonGroup')) {
        const index = key[key.length - 1];
        if (rawValues['answers' + index].toLowerCase() === 'button') {
          questionnaireValid = !!rawValues[key];
        }
      }
    }

    if (questionnaireValid) {
      const questionArray: QuestionData[] = [];
      for (const [key, value] of Object.entries(rawValues)) {
        if (key.includes('question')) {
          const index = key[key.length - 1];
          const question: QuestionData = {
            question: rawValues['questions' + index],
            answerOptions: rawValues['answers' + index]?.toLowerCase(),
            constraint: rawValues['constraints' + index],
          };
          question.constraint = question.answerOptions === 'button' ? 'isString' : question.constraint;

          if (question.answerOptions === 'button') {
            question.answerOptions = Object.keys(rawValues['buttonGroup' + index]).map(function (key) {
              return rawValues['buttonGroup' + index][key];
            });
          }
          questionArray.push(question);
        }
      }

      const formData = {
        name: rawValues.name,
        questions: questionArray,
        status: rawValues.status,
        formowner: JSON.parse(localStorage.getItem('userInfo')).username,
      };
      this.quoteService
        .addQuestionnaire(JSON.stringify(formData))
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
              this.addQuestionnaireForm.reset();
            }
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
          }
        );
    }
  }

  deleteQuestionnaire(id: string) {
    this.ngxLoader.start();
    this.quoteService
      .deleteQuestionnaire(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200 && res.body) {
            this._snackBar.open(`Questionnaire deleted!`, '', {
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

  editQuestionnaire(content: TemplateRef<any>, data: any) {
    this.questionnaires = [];
    this.selectedQuestionnaireID = data.id;
    this.ngxLoader.start();
    this.listToPopulate = data.foods ? data.foods : [];
    this.editQuestionnaireForm.patchValue({
      name: data.name ? data.name : '',
      description: data.description ? data.description : '',
    });
    this.modalService.open(content, { size: 'md', backdropClass: 'light-blue-backdrop' });
    this.getQuestionnaires();
  }

  addQuestion() {
    console.log(this.addQuestionnaireForm.value);
    this.addQuestionnaireForm.addControl(
      'questions' + this.containers.length,
      new FormControl('', Validators.required)
    );
    this.addQuestionnaireForm.addControl('answers' + this.containers.length, new FormControl('', Validators.required));
    this.addQuestionnaireForm.addControl(
      'constraints' + this.containers.length,
      new FormControl('', Validators.required)
    );
    this.addButton(this.containers.push([1]) - 1);
  }

  addButton(index: number) {
    console.log(index);
    const buttonGroup: FormGroup = this.addQuestionnaireForm.get('buttonGroup' + index) as FormGroup;
    if (!buttonGroup) {
      this.addQuestionnaireForm.addControl(
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

  patchQuestionnaire(id: any) {
    if (this.editQuestionnaireForm.valid) {
      const data2Send = this.editQuestionnaireForm.value;
      this.quoteService
        .editQuestionnaire(data2Send, id)
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
              this.getQuestionnaires();
              this.modalService.dismissAll();
              this.editQuestionnaireForm.reset();
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

  filterQuestionnaireData(data: any) {
    if (data !== undefined) {
      const questionnaire = data.map((ques: any) => {
        return {
          id: ques.id,
          name: ques.name,
          questions: ques.questions,
          answers: ques.answers,
          formowner: ques.employee.username,
          status: ques.status,
          createdAt: ques.createdAt,
        };
      });
      this.dataSource = new MatTableDataSource<FormsData>(questionnaire);
      setTimeout(() => (this.dataSource.paginator = this.paginator));
    }
  }
}
