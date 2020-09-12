export class OwnerRequestInfo {
  constructor(
    public id: number,
    public ownerName: string,
    public ownerPhoneNumber: string,
    public organizationName: string,
    public email: string,
    public comments: string,
    public registeredDate: Date,
    public ownerId: number,
    public done: boolean
  ) {}
}
