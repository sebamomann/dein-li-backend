import {Exception} from "./Exception";

export class InvalidAttributesException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'INVALID_ATTRIBUTE';
        } else {
            this.code = code;
        }

        this.message = message;
        this.data = data;
    }
}
