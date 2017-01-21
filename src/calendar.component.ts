import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

interface Day {
  day: number,
  month: number,
  which: ( 'prev' | 'current' | 'next' )
};

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private today: moment.Moment;
  public weekdays: Array<string>;
  public date:moment.Moment;
  public daysInMonth: Array<number> = [];

  public formatedDate: string = '';
  public calendarDate: string = '';
  public year: string = '';

  constructor() {
    this.today = moment();
    this.date = moment();
    this.weekdays = _.map(moment.weekdaysMin(), x => x[0]);
    this.formatDate();
  }

  ngOnInit(){
    console.debug('ngOnInit');
    this.update();
  }

  dayClicked = (day: Day) => {
    console.debug('dayClicked', day);

    if(this.isDisabled(day)) { return; }

    this.date.date(day.day);
    this[`${day.which}Month`]();
  }

  nextMonth = () => {
    console.debug('nextMonth');

    this.date.add(1, 'month');
    this.update();
  }

  currentMonth = () => {
    console.debug('currentMonth');

    this.formatDate();
  }

  prevMonth = () => {
    console.debug('prevMonth');

    this.date.subtract(1, 'month');
    this.update();
  }

  update = () => {
    console.debug('update');

    let date = this.date.clone();

    let firstWeekday = date.startOf('month').day();
    let lastWeekday = date.endOf('month').day();

    let prevMonth = date.clone().subtract(1, 'month')
    let prevMonthlastDay = prevMonth.endOf('month').date();
    let prevMonthNumber = prevMonth.month();
    let prevMonthDays = _.rangeRight(prevMonthlastDay, prevMonthlastDay - firstWeekday)
      .map(day => {
        return { day: day, month: prevMonthNumber, which: 'prev' };
      });

    let nextMonthNumber = date.clone().add(1, 'month').month();
    let nextMonthDays = _.range(1, 7 - lastWeekday)
      .map(day => {
        return { day: day, month: nextMonthNumber, which: 'next' };
      });

    let currentMonthNumber = date.month();
    let daysInMonth = _.range(1, date.daysInMonth() + 1)
      .map(day => {
        return { day: day, month: currentMonthNumber, which: 'current' };
      });

    daysInMonth = _(prevMonthDays)
      .concat(daysInMonth)
      .concat(nextMonthDays)
      .chunk(7)
      .value();

    this.daysInMonth = daysInMonth;
    this.formatDate();
  }

  formatDate = () => {
    this.year = this.date.format("YYYY");
    this.formatedDate = this.date.format('ddd, D MMM');
    this.calendarDate = this.date.format('MMMM YYYY');
  }

  isToday = (day: Day) => this.today.date() === day.day && this.today.month() == day.month

  isSelected = (day: Day) => day.which == "current" && day.day === this.date.date()

  isntCurrent = (day: Day) => day.which != "current"

  isDisabled = (day: Day) => false

}
