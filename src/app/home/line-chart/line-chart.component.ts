import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ConstraintEnum, Customer } from 'src/types/Customer';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() customer: Customer;

  lineChartData: ChartDataSets[] = [];

  lineChartLabels: Label[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{ id: 'y', ticks: { beginAtZero: true } }],
    },
    spanGaps: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins: any = [];
  lineChartType = 'line';

  rotateArray(arr: [], k: number) {
    if (arr.length > k) {
      arr.unshift(...arr.splice(-k));
    } else {
      let i = 0;
      while (i < k) {
        arr.unshift(arr.splice(-1) as never);
        i++;
      }
    }
    return arr;
  }

  constructor() {}

  ngOnInit(): void {
    console.log(this.customer);
    const questions = this.customer.question;
    let sleepQuestions = questions.filter((q) => q.constraint === ConstraintEnum.IsSleep);
    let weightQuestions = questions.filter((q) => q.constraint === ConstraintEnum.IsWeight);
    let firstDay = 0;

    // Take only last 7 elements of each array
    if (sleepQuestions.length > 7) {
      sleepQuestions = sleepQuestions.slice(-7);
    }
    if (weightQuestions.length > 7) {
      weightQuestions = weightQuestions.slice(-7);
    }

    // Set the chart data from the questions
    const sleepData = sleepQuestions.map((q) => Number(q.answer) || null);
    const weightData = weightQuestions.map((q) => Number(q.answer) || null);

    this.lineChartData = [
      { data: sleepData, label: 'Sleep' },
      { data: weightData, label: 'Weight' },
    ];

    // get firstday from first question
    if (weightQuestions.length !== 0) {
      const createdAtDateObject = new Date(weightQuestions[0]?.createdAt);
      firstDay = createdAtDateObject?.getDay() || 0;
    } else if (sleepQuestions.length !== 0) {
      const createdAtDateObject = new Date(sleepQuestions[0]?.createdAt);
      firstDay = createdAtDateObject?.getDay() || 0;
    }

    // Rotate label array to the first day
    this.lineChartLabels = this.rotateArray(this.lineChartLabels as [], firstDay);
  }
}
