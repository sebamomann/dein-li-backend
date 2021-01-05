import {Exception} from "./Exception";

export class EntityGoneException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'GONE';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Requested entity is not present anymore';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
