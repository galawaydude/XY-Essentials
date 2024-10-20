const asyncHandler = require('express-async-handler');
const { oauth2client } = require('../config/googleConfig');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIMEOUT = process.env.JWT_TIMEOUT;


// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax', // Can also use 'Lax' depending on your needs
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login user & get token
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        // Find user by email
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Set to true in production
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};


const googleLogin = asyncHandler(async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

        console.log(userRes.data);

        const { email, name, picture } = userRes.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name,
                email: email,
                pfp: picture
            })
        }

        const { _id } = user;
        // const token = generateToken(_id); 
        const token = jwt.sign({ _id, email }, JWT_SECRET,
            {
                expiresIn: JWT_TIMEOUT
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax', // Can also use 'Lax' depending on your needs
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return res.status(200).json({
            message: 'Success',
            token,
            user
        })

    } catch (err) {
       console.error('Error during Google login:', err); 
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with Google',
            error: err.message,
        });
    }
});

module.exports = {
    registerUser,
    authUser,
    googleLogin 
};