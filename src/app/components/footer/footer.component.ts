import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerImage:string = "./assets/images/benchmark.png";
  constructor() { }

  ngOnInit() {
  }

}
