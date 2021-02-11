import {Exception} from "./Exception";

export class InvalidAttributesException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'INVALID_ATTRIBUTES';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = "Given attributes can not be processed";
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
