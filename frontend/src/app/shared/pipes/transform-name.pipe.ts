import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
  name: 'transformName',
  standalone: true
})
export class TransformNamePipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(0,1).toUpperCase() + value.slice(1, value.length).toLowerCase();
  }
}
