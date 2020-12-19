import {Link} from "../link.entity";
import {Call} from "./call.entity";

export class CallUndefined extends Call {
    constructor(link: Link) {
        super();

        this.link = link;
        this.status = null;
    }
}
