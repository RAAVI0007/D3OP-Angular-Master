import { Directive, Input, ElementRef, OnInit, Renderer } from "@angular/core";

@Directive({selector: '[sortDomainColumn]'})

export class DomainSortDirective implements OnInit {
  @Input() data: any[];
  @Input('domainSortKey') key: any;
  private toggleSort: boolean = false;

  constructor (private el: ElementRef, private renderer: Renderer) {
  }

  ngOnInit () {
    this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      let parentNode = this.el.nativeElement.parentNode;
      let children   = parentNode.children;

      if (this.data && this.key) {
        let sortedData: any = this.sortArray();
      }
      this.toggleSort = !this.toggleSort;
    })
  }

  sortArray (): Array<any> {
    let tempArray: Array<any> = this.data;
    tempArray.sort((a, b) => {
       let str1: string = a[this.key];
        let str2: string = b[this.key];

        if (this.toggleSort) {
          if (str1 < str2) {
            return -1;
          }
          if (str1 > str2) {
            return 1;
          }
        }
        else {
          if (str1 > str2) {
            return -1;
          }
          if (str1 < str2) {
            return 1;
          }
        }
      return 0;
    });
    return tempArray;
  }
}