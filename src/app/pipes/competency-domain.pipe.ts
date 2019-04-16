import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'competencyDomain'
})
export class CompetencyDomainPipe implements PipeTransform {

  transform(competencies: any[], competencyDomain: string[]): any[] {
    if (!competencyDomain || competencyDomain.length === 0) return competencies;
    return competencies.filter(competencies => competencyDomain.includes(competencies.domain));
  }

}
