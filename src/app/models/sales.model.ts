import { Agency } from './agency.model';
import { Service } from './service.model';
import { User } from './users.model';
import { Client } from './client.model';



export class Sale {
    id?: any;
    date: Date;
    value: any;
    dicount: any;
    codebar?: string;
    state: 'Aprovado | Denegado | Cancelada';
    agency: Agency;
    detail: Service[];
    seller: User;
    client: Client;
}
