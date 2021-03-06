const User = require('../models/User');
const bcrypt = require('bcrypt');
const errUtils = require('./utils/error');

module.exports = {
    async findCustomerAccount(email, password, done) {
        const user = await User.findOne({
            email: email
        })
        try {
            if (!user) {
                return done(null, false)
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            });
        } catch (err) {
            throw new Error(errUtils.buildAuthRepoErrMsg('findCustomerAccount', err))
        }
    },
    async findOne(filter) {
        try {
            const result = await User.findOne(filter);
            return result
        } catch (err) {
            throw new Error(errUtils.buildAuthRepoErrMsg('findOne', err))
        }
    },
    async createOne(name, email, password) {
        const newUser = new User({
            name,
            email,
            password
        });
        bcrypt.genSalt(10, async (err, salt) => {
            try {
                const hash = await bcrypt.hash(newUser.password, salt)
                newUser.password = hash
                await newUser.save();
                return;
            } catch (err) {
                throw new Error(errUtils.buildAuthRepoErrMsg('createOne', err))
            }
        });
    },
    async googleAuthFindOne(filter) {
        try {
            const result = await User.findOne(filter);
            return result
        } catch (err) {
            throw new Error(errUtils.buildAuthRepoErrMsg('googleAuthFindOne', err));
        }
    },
    async createGoogleUser(name, email) {
        try {
            const newUser = new User({
                name,
                email,
                googleUser: true
            })
            await newUser.save();
            return newUser
        } catch (err) {
            throw new Error(errUtils.buildAuthRepoErrMsg('createGoogleUser', err));
        }
    },
    // async findUserById (id) {
    //     const user = await User.findById (id);
    //     if (err,user) return done(err, user);
    //     console.log('deseria')
    // }
}