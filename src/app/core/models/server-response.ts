export class ServerResponse {
    constructor(public statusCode: StatusCode) { }
}

export class ServerResponseGeneric<T> extends ServerResponse{

    constructor(public statusCode: StatusCode, 
        public data: T) { super(statusCode); }
}



export enum StatusCode {
    Ok,
    IncorrectVerificationCode,
    CodeHasAlreadyBeenSent,
    Expired,
    SendingMessageError,
    LinkHasAlreadyBeenSent,
    SendingMailError,
    UserNotFound,
    IncorrectLoginOrPassword,
    Error,
    UserRegistered,
    EmailUsed,
    TokenError,
    SendOnConfirmation,
    NotAvailable,
    SendingNotificationError,
    RoleNotFound,
    InvalidRole,
    UserBlocked,
    UserUnblocked,
    UserDeleted,
    DbConnectionError,
    NotFound,
    Duplicate,
    EmailNotConfirmed,
    BlobError
}