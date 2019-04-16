import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class GlobalService {

    _loggedIn:boolean = false;
    _userId:number;
    _username:string;
    _password:string;

    constructor(private _http:HttpClient) {}

    get loggedIn(): boolean {
        return this._loggedIn;
    }

    set loggedIn(_loggedIn: boolean) {
       this._loggedIn = _loggedIn;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(_userId: number) {
       this._userId = _userId;
    }


    get username(): string {
        return this._username;
    }

    set username(_username: string) {
       this._username = _username;
    }

    get password(): string {
        return this._password;
    }

    createHeaders(headers: HttpHeaders) {
        headers.append('Authorization', 'Basic '+btoa(this.username+":"+this.password)),
        headers.append('Content-Type', 'application/json')
    }

    set password(_password: string) {
       this._password = _password;
    }
}