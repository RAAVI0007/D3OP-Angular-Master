import { SecurityQuestion } from "./securityQuestion.model";
import { Role } from "./role.model";

export class Strategist {
    id: number ;
    username: string ;
	email: string;
    password: string;
    firstName: string;
    lastName: string;
    securityQuestion:SecurityQuestion;
    securityQuestionAnswer: string;
    role: Role;
    firstLogin: boolean;
    forgotPassword: string;
    emailExpiry: Date;
    questionUpdated: boolean;
	adminPassword: string;
}