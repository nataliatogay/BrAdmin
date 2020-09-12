import { ClientPhoneInfo } from './client-phone-info';
import { ClientParameterInfo } from './client-parameter-info';
import { ClientImageInfo } from './client-image-info';
import { OrganizationInfo } from './organization-info';
import { ClientAdminInfo } from './client-admin-info';
import { ClientCharacteristicsInfo } from './client-characteristics-info';

export class ClientInfoFull {
    constructor(
        public id: number,
        public clientName: string,
        public characteristics: ClientCharacteristicsInfo,
        public admins: ClientAdminInfo[],
        public logoPath: string,
        public images: ClientImageInfo[],
        public registrationDate: Date,
        public confirmedByAdmin: Date,
        public blocked: Date,
        public deleted: Date
    ) { }
}
