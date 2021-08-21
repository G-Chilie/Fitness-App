import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartDataset, ChartOptions, ScriptableLineSegmentContext } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'hammerjs';
import * as _ from 'lodash';
import { ConstraintEnum, Customer } from 'src/types/Customer';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() public customer: Customer;

  currentColorMode: any;

  lineChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Weight',
      yAxisID: 'weight',
      backgroundColor: 'rgba(173,255,47,0.5)',
      segment: {
        borderColor: (ctx) => this.colorSegmentFunction(ctx, 'gray'),
        borderDash: (ctx) => this.borderDashSegmentFunction(ctx, [6, 6]),
      },
    },
    {
      data: [],
      label: 'Sleep',
      yAxisID: 'sleep',
      backgroundColor: 'rgba(0,191,255, 0.5)',
      segment: {
        borderColor: (ctx) => this.colorSegmentFunction(ctx, 'gray'),
        borderDash: (ctx) => this.borderDashSegmentFunction(ctx, [6, 6]),
      },
    },
  ];

  lineChartLabels: string[] = [];

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      weight: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        min: 0,
        suggestedMax: 100,
        bounds: 'data',
        grace: 20,
      },
      sleep: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        grid: { display: false },
        suggestedMax: 16,
        suggestedMin: 0,
      },
    },
    elements: { line: { borderColor: 'black', borderWidth: 3, fill: true } },
    spanGaps: true,
    interaction: {
      intersect: false,
    },

    plugins: {
      zoom: {
        limits: {
          x: { minRange: 9 },
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          pinch: { enabled: true },
          wheel: { enabled: true, speed: 0.5 },
          mode: 'x',
        },
      },
    },
  };

  lineChartLegend = true;
  lineChartPlugins: any[] = [zoomPlugin];
  lineChartType = 'line';

  borderDashSegmentFunction = (ctx: ScriptableLineSegmentContext, value: number[]) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;

  colorSegmentFunction(ctx: ScriptableLineSegmentContext, color: string) {
    return ctx.p0.skip || ctx.p1.skip ? color : undefined;
  }

  getDatesArray(start: Date, end: Date) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  }

  sameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  constructor() {}

  ngOnInit(): void {
    console.log(Math.max(...(this.lineChartData[0].data as number[])));
    const questions = this.customer.question;
    let sleepQuestions = questions.filter((q) => q.constraint === ConstraintEnum.IsSleep);
    let weightQuestions = questions.filter((q) => q.constraint === ConstraintEnum.IsWeight);
    let labelArray: Date[] = [];

    if (sleepQuestions.length === 0 && weightQuestions.length !== 0) {
      labelArray = this.getDatesArray(new Date(weightQuestions[0].createdAt), new Date());
    } else if (sleepQuestions.length !== 0 && weightQuestions.length === 0) {
      labelArray = this.getDatesArray(new Date(sleepQuestions[0].createdAt), new Date());
    } else if (sleepQuestions.length !== 0 && weightQuestions.length !== 0) {
      const firstWeightDate = new Date(weightQuestions[0].createdAt);
      const firstSleepDate = new Date(sleepQuestions[0].createdAt);
      firstWeightDate > firstSleepDate
        ? (labelArray = this.getDatesArray(firstSleepDate, new Date()))
        : firstWeightDate < firstSleepDate
        ? (labelArray = this.getDatesArray(firstWeightDate, new Date()))
        : (labelArray = this.getDatesArray(firstWeightDate, new Date()));
    }
    this.lineChartLabels = labelArray.map((d) => d.toLocaleDateString().split('T')[0].replace(/-/g, '/'));

    const weightData = new Array(this.lineChartLabels.length).fill(undefined);
    weightQuestions.forEach((q) => {
      const index = labelArray.findIndex((date) => this.sameDay(new Date(q.createdAt), date));
      q.answer === null ? (weightData[index] = null) : (weightData[index] = Number(q.answer));
    });

    const sleepData = new Array(this.lineChartLabels.length).fill(undefined);
    sleepQuestions.forEach((q) => {
      const index = labelArray.findIndex((date) => this.sameDay(new Date(q.createdAt), date));
      q.answer === null ? (sleepData[index] = null) : (sleepData[index] = Number(q.answer));
    });

    this.lineChartData.find((dataObject) => dataObject.label.toLowerCase() === 'weight').data = weightData;
    this.lineChartData.find((dataObject) => dataObject.label.toLowerCase() === 'sleep').data = sleepData;
  }

  userPreference(preferenceName: string) {
    let data2Send = {};
    switch (preferenceName) {
      case 'greyScale':
        data2Send['greyScale'] = this.currentColorMode;
        break;

      case 'yellowBlue':
        data2Send['yellowBlue'] = this.currentColorMode;
        break;
    }
  }
}
