export class InsufficientPermissionsException implements Error {
    message: string;
    name: string;
    data: string;
    code: string;

    constructor(code: string = null, message: string = null, data: any = null) {
        if (code === null
            || code === '') {
            this.code = 'FORBIDDEN';
        } else {
            this.code = code;
        }

        if (message === null
            || message === '') {
            this.message = 'Missing permissions to execute request';
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
