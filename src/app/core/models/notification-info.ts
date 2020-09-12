export class NotificationInfo {
    constructor(
        public id: number,
        public title: string,
        public dateTime: Date,
        public done: boolean,
        public notificationType: string,
        public clientId: number,
        public requestId: number
    ) { }
}
