import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../utility/constants';
import { Subscription, Observable } from 'rxjs';

const CHECK_MODAL_INTERVAL = 1000; // 1 seconds
const CHECK_INTERVAL = 1000; // 1 seconds
const STORE_KEY =  'lastAction';
const STORE_MODAL_KEY = "lastOpened";
const DEFAULT_SESSION_INTERVAL = 19*1000*60; //defaults to 19
const EXTENDED_SESSION_TOKEN = 6*60*1000; //calling the jwt token for every 6 minutes to make back end calls with out 401
const MODAL_SESSION_INTERVAL = 1000*60; //modal opening timer defaults to 1 minute
@Injectable()
export class AutoLogoutService implements OnInit, OnDestroy  {
    private baseUrl:string = Constants.BASE_URL+'/user/getExtendedSession';
    private logoutURL:string = Constants.BASE_URL+'/user/logout';
    interval:any;
    modalIntervalTimer:any;
    sessionExtendedInterval:any;
    tokenInterval:any;
    subscr: Subscription;

    ngOnInit() {
        this.initListener();
        this.initInterval();
        this.tokenInitInterval();
        this.setModalLastAction(Date.now());
    }

    startModalTimer() {
        this.modalInitInterval();
    }

    ngOnDestroy() {
        this.destroyListener();
        this.destroyInterval();
        this.destroyTokenInterval();
    } 

    destroyModalTimer() {
        this.destroyModalInterval();
    } 

    public getLastAction() {
        return parseInt(localStorage.getItem(STORE_KEY));
    }

    public setLastAction(lastAction: number) {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    }

    public getModalLastAction() {
        return parseInt(localStorage.getItem(STORE_MODAL_KEY));
    }

    public setModalLastAction(lastAction: number) {
        localStorage.setItem(STORE_MODAL_KEY, lastAction.toString());
    }

    constructor(private router: Router,
                private _http:HttpClient) { 
    }

    initListener() {
       document.body.addEventListener('mouseover',()=> this.reset(), false);
    }
    

    destroyListener() {
       document.body.removeEventListener('mouseover',()=> this.reset(), true);
    }

    reset() {
        this.setLastAction(Date.now());
    }

    initInterval() {
        this.interval = setInterval(() => {
            this.checkLastAccessed();
        }, CHECK_INTERVAL);
    }

    modalInitInterval() {
        this.modalIntervalTimer = setInterval(() => {
            this.modalCheck();
        }, CHECK_MODAL_INTERVAL);
    }

    tokenInitInterval() {
        this.subscr = Observable.interval(EXTENDED_SESSION_TOKEN)
                                .flatMap(() => this.checkToken())
                                .subscribe(data => {
                               
        });
    }

    checkToken() {
        return this._http.get(this.baseUrl);
    }

    destroyInterval() {
        clearInterval(this.interval);
     }

     destroyModalInterval() {
        clearInterval(this.modalIntervalTimer);
     }

     destroyTokenInterval() {
        if(this.subscr != null)
            this.subscr.unsubscribe();
     }

    checkLastAccessed() {
        if((Date.now() - this.getLastAction()) >= DEFAULT_SESSION_INTERVAL) {
            let element = document.getElementById("session-timeout") as any;
            element.click();
            this.ngOnDestroy();
            this.setModalLastAction(Date.now());
            this.startModalTimer();
        }
     }  

     modalCheck() {
        if((Date.now() - this.getModalLastAction()) >= MODAL_SESSION_INTERVAL) {
            this.destroyModalTimer(); 
            let element = document.getElementById("session-logout-cancel") as any;
            element.click();
            this.logout('true');
        }
     }    

    extendSession() {
        this.destroyModalInterval();
        this.ngOnDestroy();
        this.ngOnInit();
        return this._http.get(this.baseUrl);
    }

    logout(condition:string) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("timeout", condition);
        //enev though not called to any event, for safe side removing all the listeners
        this.closeSession()
        this.destroyModalTimer();
        this.destroyModalInterval();
        this.ngOnDestroy();
        this.router.navigateByUrl('');   
    }

    closeSession() {
        this._http.get(this.logoutURL);
    }
}
