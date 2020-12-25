import {Link} from "./link.entity";

module.exports = {
    basic: function (_link: Link) {
        const newLink = (({
                              id,
                              short,
                              original,
                              nrOfCalls,
                              iat,
                          }) =>
            ({
                id,
                short,
                original,
                nrOfCalls,
                iat,
            }))
        (_link);

        return newLink;
    },
};
