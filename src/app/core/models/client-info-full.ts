import { ClientPhoneInfo } from './client-phone-info';
import { ClientParameterInfo } from './client-parameter-info';
import { ClientImageInfo } from './client-image-info';
import { OrganizationInfo } from './organization-info';

export class ClientInfoFull {
    constructor(
        public id: number,
        public clientName: string,
        public organization: OrganizationInfo,
        public email: string,
        public adminName: string,
        public adminPhoneNumber: string,
        public mainImagePath: string,
        public images: ClientImageInfo[],
        public registrationDate: Date,
        public confirmed: Date,
        public blocked: Date,
        public deleted: Date,
        public lat: number,
        public long: number,
        public openTime: number,
        public closeTime: number,
        public priceCategory: number,
        public maxReserveDays: number,
        public reserveDurationAvg: number,
        public barReserveDurationAvg: number,
        public confirmationDuration: number,
        public description: string,
        public socialLinks: string[],
        public phones: ClientPhoneInfo[],
        public mealTypeIds: ClientParameterInfo[],
        public clientTypeIds: ClientParameterInfo[],
        public cuisineIds: ClientParameterInfo[],
        public specialDietIds: ClientParameterInfo[],
        public goodForIds: ClientParameterInfo[],
        public dishIds: ClientParameterInfo[],
        public featureIds: ClientParameterInfo[]



    ) { }
}
