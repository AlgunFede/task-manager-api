const express = require('express');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail } = require('../emails/account');


// Setting up upload with Multer npm
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error('Please, upload a PNG, JPG or JPEG file'))
        }
        cb(undefined, true)
    }
})

// Route to get/upload/delete user profile

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/avatar', auth, upload.single(), async (req, res) => {
    
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/users/:id/avatar', async (req, res) => {
    
    try {
         const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw Error()
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar)

    } catch(e) {
        res.status(400).send({ error: error.message })
    }
})

// Create user
router.post('/users/me', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send( {user, token} );
    } catch (e) {
        res.status(400).send(e)
    }
});

// Login user
router.post('/users/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token })

    } catch(e) {
        res.status(400).send({ error: "User not found" });
    } 

})

// Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send({ success: 'User logout succesfully' })
    } catch(e) {
        res.status(500).send({ error: e })
    }
});

// Logout all devices

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ success: 'Devices succesfully logouted' })

    } catch(e) {
        res.status(500).send()
    }
})

// Getting all users
router.get('/users/me', auth, async (req, res) => {
    
    res.send(req.user)

})

// Edit user information
router.patch('/users/me', auth, async (req, res) => {
    const _id = req.user._id;
    const validation = { new: true, runValidators: true};

    //Validate if property exist
    const allowUpdates = ['name', 'email', 'password', 'age']
    const changes = Object.keys(req.body)

    const isValidate = changes.every((change) => allowUpdates.includes(change));

    if (!isValidate) {
        return res.status(400).send({ error: 'Can not change the actual value'} )
    }

    try {
        // const user = await User.findByIdAndUpdate(_id, req.body, validation)
        
        const user = await User.findById(_id)
        changes.forEach((change) => {
            user[change] = req.body[change]
        })
        await user.save()
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete user

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id;

    try {
        req.user.remove()
        res.send(req.user)

    } catch(e) {
        res.status(500).send(e)
    }

});

module.exports = router;