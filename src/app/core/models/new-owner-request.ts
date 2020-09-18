export class NewOwnerRequest {
    constructor(
        public ownerName: string,
        public email: string,
        public ownerNumber: string,
        public organizationTitle: number,
        public requestId: number
    ) { }
}
