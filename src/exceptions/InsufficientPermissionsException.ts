import {Exception} from "./Exception";

export class InsufficientPermissionsException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'INSUFFICIENT_PERMISSIONS';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Missing permissions to execute request';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
