import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() userHome: string;
  @Input() partitionSymbolEngagement: string;
  @Input() engagementNameTitle: string;
  @Input() engagementId: string;
  @Input() teamId: string;
  @Input() partitionSymbolTeamProduct: string;
  @Input() teamNameTitle: string;
  @Input() productId: string;
  @Input() productNameTitle: string;
  @Input() profileTitle: string;
  @Input() profilePageLanded: boolean;
  @Input() administratorTitle: string;
  @Input() administratorPageLanded: boolean;
  @Input() legendsLink: boolean;
  constructor() { }

  ngOnInit() {
  }


}
