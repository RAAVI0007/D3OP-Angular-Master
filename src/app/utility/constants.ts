import { environment } from './../../environments/environment';

export class Constants {
    public static get BASE_URL(): string { 
        //return "http://localhost:8080/benchmark"
        return environment.baseURL;
    }
}
