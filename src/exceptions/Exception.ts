export class Exception implements Error {
    name: string;
    data: any;
    code: string;
    message: string;

    parse() {
        return {
            code: this.code,
            message: this.message,
            data: this.data
        };
    }
}
