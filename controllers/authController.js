const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { sendActivationMail } = require('../providers/mail')
module.exports.registerUser = async (req, res) => {
    // profilePhoto:
    // ---------
    // profilePhoto should be a image file

    let profilePhotoPath = ''

    if (req.files) {
        const profilePhoto = req.files.profilePhoto
        const imageFormats = ['png', 'jpg', 'jpeg', 'ico']
        const isImageFormarAllowed = imageFormats.includes(
            profilePhoto.mimetype.split('/')[1]
        )

        if (!isImageFormarAllowed)
            req.check(
                'profilePhoto',
                'Only image format is allowed for profile photo'
            ).custom(() => false)
        else {
            // TODO: name profile photo with user id
            profilePhoto.mv(
                __dirname +
                    '/../public/images/profilePhotos/' +
                    profilePhoto.name
            )
            profilePhotoPath = '/images/profilePhotos/' + profilePhoto.name
        }
    }

    // Name:
    // ---------
    // Name can not be empty
    // Name should be atleast 6 character
    if (req.body.name.length === 0)
        req.check('name', 'Name can not be empty').custom(e => false)
    else
        req.check('name', 'Name should be atleast 6 character').isLength({
            min: 6,
        })

    // Username:
    // ---------
    // username can not be empty
    // username should be unique
    // username Name chould be atleast 6 character
    const isUsernameExists = await User.findOne({
        username: req.body.username,
    })
    if (req.body.username.length === 0)
        req.check('username', 'Username can not be empty').custom(e => false)
    else if (isUsernameExists) {
        req.check(
            'username',
            `Username <b>${
                req.body.username
            }</b> is already used by other account`
        ).custom(() => false)
    } else
        req.check(
            'username',
            'username chould be atleast 6 character'
        ).isLength({
            min: 6,
        })
    // Email:
    // ---------
    // email can not be empty
    // Valid Email
    // email should be unique
    const isEmailExists = await User.findOne({
        email: req.body.email,
    })
    if (req.body.email.length === 0)
        req.check('email', 'Email can not be empty').custom(() => false)
    else
        req.check(
            'email',
            `<b>${req.body.email}</b> is not a valid email address`
        ).isEmail()
    if (isEmailExists)
        req.check(
            'email',
            `Email address <b>${
                req.body.email
            }</b> is already used by other account`
        ).custom(() => false)
    // Password:
    // ---------
    // can not be empty
    // atleast 6 character
    // match with confirmPassword
    if (req.body.password.length === 0)
        req.check('password', 'Password can not be empty').custom(() => false)
    else if (req.body.password.length < 6)
        req.check(
            'password',
            'Password length should be atleast 6 character'
        ).custom(() => false)
    else
        req.check(
            'password',
            'Password did not matched with confirm password'
        ).equals(req.body.comfirm_password)

    if (req.validationErrors()) {
        req.flash('errors', req.validationErrors())
        res.redirect('back')
    }

    // Here everything correct, now store user to database 😍
    const { name, username, email, password } = req.body
    const userInstance = new User({
        profileProto: profilePhotoPath,
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 10),
    })
    const saveduser = await userInstance.save()

    sendActivationMail(saveduser.email, {
        btnUrl: `http://localhost:3000/activate/${saveduser.activationCode}`,
        btnText: 'Activate your account',
    }).then(emailSent => {
        req.flash(
            'success_msg',
            'You have successfully Registered , please activate your account'
        )
    })

    // after registration
    // Redirect to login page with a flash msg

    res.redirect('/auth/login')
}

module.exports.updateUser = async (req, res) => {
    // Name:
    // ---------
    // Name can not be empty
    // Name should be atleast 6 character
    if (req.body.name.length === 0)
        req.check('name', 'Name can not be empty').custom(e => false)
    else
        req.check('name', 'Name should be atleast 6 character').isLength({
            min: 6,
        })

    // Password:
    // ---------
    // Is password field is filled then we will proceed
    // password should be atleast 6 character
    if (req.body.password.length > 0) {
        req.check(
            'password',
            'password should be atleast 6 character'
        ).isLength({ min: 6 })
    }

    // Username:
    // ---------
    // username can not be empty
    // if username is current user then proceed
    // username should be unique
    const existedUser = await User.findOne({
        username: req.body.username,
    })
    if (req.body.username.length === 0)
        req.check('username', 'Username can not be empty').custom(e => false)
    else if (existedUser && existedUser.username !== req.user.username) {
        req.check(
            'username',
            `Username <b>${req.user.username}</b> is taken vai another account`
        ).custom(() => false)
    }

    // Email:
    // ---------
    // email can not be empty
    // Valid Email
    // email should be unique
    const isEmailExists = await User.findOne({
        email: req.body.email,
    })
    if (req.body.email.length === 0)
        req.check('email', 'Email can not be empty').custom(() => false)
    else
        req.check(
            'email',
            `<b>${req.body.email}</b> is not a valid email address`
        ).isEmail()
    if (isEmailExists && isEmailExists.email !== req.user.email)
        req.check(
            'email',
            `Email address <b>${
                req.body.email
            }</b> is already used by other account`
        ).custom(() => false)

    // profileProto:
    // -----------------
    // If profile photo uploaded then update photo
    // validation check
    let profilePhotoPath = ''
    if (req.files) {
        const profilePhoto = req.files.profilePhoto
        const imageFormats = ['png', 'jpg', 'jpeg', 'ico']
        const isImageFormarAllowed = imageFormats.includes(
            profilePhoto.mimetype.split('/')[1]
        )

        if (!isImageFormarAllowed)
            req.check(
                'profilePhoto',
                'Only image format is allowed for profile photo'
            ).custom(() => false)
        else {
            // TODO: name profile photo with user id
            profilePhoto.mv(
                __dirname +
                    '/../public/images/profilePhotos/' +
                    profilePhoto.name
            )
            profilePhotoPath = '/images/profilePhotos/' + profilePhoto.name
        }
    }

    if (req.validationErrors()) req.flash('errors', req.validationErrors())
    else {
        const user = await User.findById(req.user._id)
        user.name = req.body.name
        user.username = req.body.username
        user.email = req.body.email
        if (profilePhotoPath) user.profileProto = profilePhotoPath
        if (req.body.password)
            user.password = bcrypt.hashSync(req.body.password)
        await user.save()

        req.flash('success_msg', 'Your profile updated successfully')
    }

    res.redirect('back')
}
