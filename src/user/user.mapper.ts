import {User} from './user.entity';
import {UserService} from './user.service';

module.exports = {
    basic: function (userService: UserService, _user: User) {
        const newUser = (({
                              id,
                              username,
                              mail,
                              iat,
                          }) =>
            ({
                id,
                username,
                mail,
                iat,
            }))
        (_user);

        return newUser;
    },
};
