import { Strategist } from "./strategist.model";
import { Customer } from "./customer.model";

export class Engagement {
    name: string;
    description: string;
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    adminPhone: string;
    billingFirstName: string;
    billingLastName: string;
    billingEmail: string;
    billingPhone: string;
    strategist: Strategist;
    customerNameOther:string;
    customer: Customer;
}



