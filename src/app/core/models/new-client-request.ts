import { ClientPhoneInfo } from './client-phone-info';

export class NewClientRequest {
    constructor(
        public organizationId: number,
        public restaurantName: string,
        public email: string,
        public adminName: string,
        public adminPhoneNumber: string,
        public lat: number,
        public long: number,
        public openTime: number,
        public closeTime: number,
        public description: string,
        public mainImage: string,
        public maxReserveDays: number,
        public reserveDurationAvg: number,
        public barReserveDurationAvg: number,
        public confirmationDuration: number,
        public priceCategory: number,
        public socialLinks: string[],
        public cuisineIds: number[],
        public clientTypeIds: number[],
        public mealTypeIds: number[],
        public dishIds: number[],
        public goodForIds: number[],
        public specialDietIds: number[],
        public featureIds: number[],
        public phones: ClientPhoneInfo[]
    ) { }
}
