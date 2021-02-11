import {Exception} from "./Exception";

export class ForbiddenAttributesException extends Exception {
    constructor(code: string = null, message: string = null, data: string[] = null) {
        super();

        if (!code) {
            this.code = 'UNAUTHORIZED';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Specified values can only be set by authorized users. Please login and try again.';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
