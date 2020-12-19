import {Exception} from "./Exception";

export class AlreadyUsedException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'USED';
        } else {
            this.code = code;
        }


        this.message = message;
        this.data = data;
    }
}
