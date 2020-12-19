export class InvalidAttributesException implements Error {
    message: string;
    name: string;
    data: string[];
    code: string;

    constructor(code: string = null, message: string = null, data: any = null) {
        if (code === null
            || code === '') {
            this.code = 'INVALID_ATTRIBUTE';
        } else {
            this.code = code;
        }

        this.message = message;
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
