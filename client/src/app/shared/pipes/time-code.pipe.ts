import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeCode',
  standalone: true
})
export class TimeCodePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || value < 0) return '00:00:00';

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');

    return `${hoursString}:${minutesString}:${secondsString}`;
  }

}
