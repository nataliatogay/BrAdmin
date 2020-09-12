export class NewOwnerRequest {
    constructor(
        public ownerName: string,
        public email: string,
        public ownerNumber: string,
        public organizationId: number,
        public requestId: number
    ) { }
}
