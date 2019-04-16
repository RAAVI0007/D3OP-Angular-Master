import { Injectable } from '@angular/core';

@Injectable()
export class MaturityConversionService {

  constructor() { }

  mappingCurrentTargetMaturityValues(value) {
    if(value == 1) return "Tin"
    else if(value == 2) return "Bronze"
    else if(value == 3) return "Silver"
    else if(value == 4) return "Gold"
    else if(value == 5) return "Platinum"
  }

  mappingNextAndComplexityMaturityValues(value) {
    if(value == 1) return "Lowest"
    else if(value == 2) return "Low"
    else if(value == 3) return "Mediun"
    else if(value == 4) return "High"
    else if(value == 5) return "Highest"
  }

  mappingPriorityRationaleValues(value) {
    if(value == "T") return "Tin"
    else if(value == "INTERNAL_INITIATIVE") return "Internal Initiative"
    else if(value == "VALUE_COMPLEXITY") return "Value vs Complexity"
    else if(value == "HIGHEST_VALUE") return "Highest Value"
    else if(value == "LOWEST_COMPLEXITY") return "Lowest Complexity"
    else if(value == "LEVELSET_TEAM_ORG") return "Level-Set Team/Org"
    else if(value == "DISTANCE_TO_DESIRED_MATURITY") return "Distance to Target Maturity"
    else if(value == "NO_ACTION_TARGET_MATURITY_REACHED") return "No Action - Target Maturity Reached"
    else if(value == "NO_ACTION_OTHER") return "No Action - Other"
  }

}
