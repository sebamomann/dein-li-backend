import {Link} from "./link.entity";

module.exports = {
    basic: function (_link: Link) {
        const newLink = (({
                              id,
                              short,
                              original,
                              iat,
                          }) =>
            ({
                id,
                short,
                original,
                iat,
            }))
        (_link);

        return newLink;
    },
};
