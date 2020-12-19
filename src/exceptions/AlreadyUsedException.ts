export class AlreadyUsedException implements Error {
    message: string;
    name: string;
    data: string[];
    code: string;

    constructor(code: string = null, message: string = null, data: any = null) {
        if (code === null
            || code === '') {
            this.code = 'USED';
        } else {
            this.code = code;
        }

        this.message = message;
        this.data = data;
    }
}
