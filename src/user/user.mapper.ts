import {User} from './user.entity';
import {UserService} from './user.service';

module.exports = {
    basic: function (userService: UserService, _user: User) {
        const newUser = (({
                              id,
                              username,
                              mail,
                              session,
                              iat,
                          }) =>
            ({
                id,
                username,
                mail,
                session,
                iat,
            }))
        (_user);

        return newUser;
    },
};
