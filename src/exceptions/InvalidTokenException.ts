import {Exception} from "./Exception";

export class InvalidTokenException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'INVALID';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Provided token is not valid';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
