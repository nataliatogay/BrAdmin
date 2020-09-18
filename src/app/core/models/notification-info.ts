import { NotificationType } from './notification-type';

export class NotificationInfo {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public dateTime: Date,
        public reference: number,
        public handled: boolean,
        public notificationTypeId: NotificationType
    ) { }
}
