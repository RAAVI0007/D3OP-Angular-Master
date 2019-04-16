import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'competencyTitle'
})
export class CompetencyTitlePipe implements PipeTransform {

  transform(availableFilters: any[], filterBy: string[]): any[] {
    if (!filterBy || filterBy.length === 0) return availableFilters;
    return availableFilters.filter(availableFilters => filterBy.includes(availableFilters.subject));
  }

}
