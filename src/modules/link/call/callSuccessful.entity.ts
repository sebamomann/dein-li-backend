import {Link} from "../link.entity";
import {Call} from "./call.entity";

export class CallSuccessful extends Call {
    constructor(link: Link) {
        super();

        this.link = link;
        this.status = 1;
    }
}
