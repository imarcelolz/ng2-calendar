import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  exports: [
    CalendarComponent
  ],
  entryComponents: [
    CalendarComponent
  ]
})
export class CalendarModule {}
