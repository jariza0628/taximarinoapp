import { Agency } from './agency.model';
import { Service } from './service.model';
import { User } from './users.model';
import { Client } from './client.model';

export class Sale {
    id?: any;
    date: Date;
    name: any;
    dni: any;
    value: any;
    dicount: any;
    codebar?: any;
    state: 'Aprovado | Denegado | Cancelada';
    agency?: any;
    detail?: any;
    plans?: any;
    seller: any;
    citylife?: any;
    total?:any 
}
export interface GeneralSale {
    clientName?: string;
    clientIdentification?: string;
    sellerName?: string;
    paymentType?: 'card' | 'credit' | 'cash' | 'mixed';
    card?: number;
    cash?: number;
    idGenerated?: string;
    id?: string;
    total?: number;
    date?: Date;
  }
  
