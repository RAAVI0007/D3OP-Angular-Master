// import { Directive, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';

// import { Subject } from 'rxjs';
// import { switchMap, take, tap } from 'rxjs/operators';

// @Directive({
//   selector: '[counter]'
// })
// export class CounterDirective implements OnChanges, OnDestroy {

//   private counter$ = new Subject<any>();
//  // private countSub$: SubscriptionLike;

//   @Input() counter: number;
//   @Input() interval: number;
//   @Output() value = new EventEmitter<number>();

//   constructor() {

   
//   }

//   ngOnChanges() {
//     this.counter$.next({ count: this.counter, interval: this.interval });
//   }

//   ngOnDestroy() {
//     this.countSub$.unsubscribe();
//   }

// }