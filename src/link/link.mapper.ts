import {Link} from "./link.entity";

function mapActiveValue(isActive: number): string {
    switch (isActive) {
        case 1:
            return "ACTIVE"
        case -1:
            return "DEPRECATED"
        case -2:
            return "LOCKED"
        case -3:
            return "DELETED"
    }
}

module.exports = {
    basic: function (_link: Link) {
        const newLink = (({
                              id,
                              short,
                              original,
                              nrOfCalls,
                              isActive,
                              iat,
                          }) =>
            ({
                id,
                short,
                original,
                nrOfCalls: +nrOfCalls ? +nrOfCalls : 0,
                status: mapActiveValue(isActive),
                iat,
            }))
        (_link);

        return newLink;
    },
    creation: function (_link: Link) {
        const newLink = (({
                              id,
                              short,
                          }) =>
            ({
                id,
                short,
            }))
        (_link);

        return newLink;
    },
};
