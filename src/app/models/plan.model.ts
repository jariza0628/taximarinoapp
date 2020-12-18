import { Service } from './service.model';

export class Plan {
    id?: any;
    name: string;
    description?: string;
    totalvalue?: any;
    discount?: any;
    agency?: any;
    services: Service[];
    code?: string;
    comissionVal?: boolean;
}
