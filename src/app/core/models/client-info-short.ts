import { ClientAdminInfo } from './client-admin-info';
import { OwnerInfo } from './owner-info';

export class ClientInfoShort {
    constructor(
        public id: number,
        public clientName: string,
        public logoPath: string,
        public owner: OwnerInfo,
        public admins: ClientAdminInfo[],
        public registrationDate: Date,
        public confirmed: Date,
        public isActive: boolean,
        public blocked: Date,
        public deleted: Date
    ) { }
}
