export class EntityNotFoundException implements Error {
    message: string;
    name: string;
    data: string;
    code: string;

    constructor(code: string = null, message: string = null, data: string = null) {
        if (code === null
            || code === '') {
            this.code = 'NOT_FOUND';
        } else {
            this.code = code;
        }

        if (message === null
            || message === '') {
            this.message = 'Requested resource could not be located';
        } else {
            this.message = message;
        }

        this.data = data;
    }

    parse() {
        return {
            code: this.code,
            message: this.message,
            data: this.data
        };
    }
}
