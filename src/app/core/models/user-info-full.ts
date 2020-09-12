export class UserInfoFull {

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public imagePath: string,
        public email: string,
        public phoneNumber: string,
        public blocked: Date,
        public deleted: Date,
        public registrationDate: Date,
        public gender: boolean,
        public birthDate: Date
    ) { }

}
