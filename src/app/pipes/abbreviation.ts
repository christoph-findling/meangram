import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'abbreviation'
})
export class AbbreviationPipe implements PipeTransform {
  transform(value: any) {
    const valueArray = value.split(' ');
    const abbreviation =
      valueArray.length > 1
        ? valueArray[0].substring(0, 1) + valueArray[1].substring(0, 1)
        : valueArray[0].substring(0, 1);
    return abbreviation;
  }
}
