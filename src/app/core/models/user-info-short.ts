export class UserInfoShort {
    
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public imagePath: string,
        public email: string,
        public phoneNumber: string,
        public blocked: Date,
        public deleted: Date,
        public registrationDate: Date
    ) { }

}
