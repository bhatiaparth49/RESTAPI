const router = require('express').Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')

router.get('/', auth, (req, res) => {
    User.findOne({ email: req.user.email }).select('-password').exec((err, user) => {
        if(err) {
            throw err
        }

        res.send(user)
    })
})

module.exports = router