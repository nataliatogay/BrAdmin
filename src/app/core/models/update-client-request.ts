import { ClientPhoneInfo } from './client-phone-info';

export class UpdateClientRequest {
    constructor(
        public clientId: number,
        public restaurantName: string,
        public lat: number,
        public long: number,
        public openTime: number,
        public closeTime: number,
        public description: string,
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
