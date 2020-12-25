const router = require('express').Router()
const User = require('../models/user')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const Refresh = require('../models/refresh')

router.post('/', (req, res) => {
    // Authorize request
    // Validate request
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.status(422).json({ error: 'All fields are required'})
    }

    // Check if user exist
    User.exists({email: email }, async (err, result) => {
        if(err) {
            return res.status(500).json({ error: 'All fields are required'})
        }

        if(result) {
            return res.status(422).json({ error: 'User with this email already exists'})
        } else {
            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = new User ({
                        name,
                        email,
                        password: hashedPassword
                    })

            user.save().then(user => {
                //Jwt
                const accessToken = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email
                }, process.env.JWT_TOKEN_SECRET, { expiresIn: '30s' })

                //Refresh token
                const refreshToken = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email
                }, process.env.JWT_REFRESH_SECRET)

                new Refresh({
                    token: refreshToken
                }).save().then(() => {
                    return res.send({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        type: 'Bearer'
                    })
                })

            }).catch(err => {
                return res.status(500).send({ error: 'Something went wrong'})
            })
        }
        
    })

})

module.exports = router