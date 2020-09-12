import { ClientPhoneInfo } from './client-phone-info';

export class ClientCharacteristicsInfo {
    constructor(
        public address: string,
        public lat: number,
        public long: number,
        public openTime: number,
        public closeTime: number,
        public dayOffs: number[],
        public description: string,
        public maxReserveDays: number,
        public reserveDurationAvg: number,
        public barReserveDurationAvg: number,
        public confirmationDuration: number,
        public priceCategory: number,
        public reservationLink: string,
        public socialLinks: string[],
        public clientTypeIds: number[],
        public mealTypeIds: number[],
        public cuisineIds: number[],
        public dishIds: number[],
        public goodForIds: number[],
        public specialDietIds: number[],
        public featureIds: number[],
        public phones: ClientPhoneInfo[]
    ) { }
}
