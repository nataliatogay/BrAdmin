export class UploadImagesRequest {

    constructor(
        public clientId: number,
        public imageStrings: string[]
    ) { }

}
