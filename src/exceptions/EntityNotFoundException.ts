import {Exception} from "./Exception";

export class EntityNotFoundException extends Exception {
    constructor(code: string = null, message: string = null, data: string | any[] | object = null) {
        super();

        if (!code) {
            this.code = 'NOT_FOUND';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Requested resource could not be located';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
