import {Exception} from "./Exception";

export class DuplicateValueException extends Exception {
    constructor(code: string = null, message: string = null, data: any = null) {
        super();

        if (!code) {
            this.code = 'DUPLICATE_ENTRY';
        } else {
            this.code = code;
        }

        if (!message) {
            this.message = 'Following values are already in use';
        } else {
            this.message = message;
        }

        this.data = data;
    }
}
