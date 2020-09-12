import { ClientPhoneInfo } from './client-phone-info';
import { NewClientCharacteristics } from './new-client-characteristics';

export class UpdateClientRequest {
    constructor(
        public clientId: number,
        public restaurantName: string,
        public logoString: string,
        public characteristicsInfo: NewClientCharacteristics
    ) { }
}
