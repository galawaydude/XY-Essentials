const asyncHandler = require('express-async-handler');
const { oauth2client } = require('../config/googleConfig');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const axios = require('axios');
const emailSender = require('../utils/emailSender');
const {sendOTP, generateOTP} = require('../services/otpService.js');
const generateToken = require('../utils/generateToken.js')
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIMEOUT = process.env.JWT_TIMEOUT;

// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log('Received registration request:', { name, email });

//     try {
//         console.log('Checking for existing user in the database...');
//         const existingUser = await User.findOne({ email });
//         console.log('Existing user check result:', existingUser ? 'User found' : 'No user found');

//         if (existingUser) {
//             console.warn('User already exists:', email);
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Generate OTP
//         console.log('Generating OTP...');
//         const otp = generateOTP();
//         console.log('Generated OTP:', otp);

//         // Send OTP to user's email
//         console.log('Sending OTP to email:', email);
//         await sendOTP(email, otp);
//         console.log('OTP sent successfully.');

//         // Store the OTP in the user's data temporarily with an expiry
//         console.log('Creating new user with temporary OTP...');
//         const user = new User({ name, email, password, otp, otpExpires: Date.now() + 15 * 60 * 1000 }); // OTP expires in 15 minutes
//         const savedUser = await user.save();
//         console.log('User temporarily created:', savedUser);

//         res.status(200).json({
//             message: 'OTP sent to email. Please verify to complete the registration.',
//             email,
//         });

//     } catch (error) {
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Error registering user', error });
//     }
// };


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received registration request:', { name, email });

    try {
        const existingUser = await User.findOne({ email });
        console.log('Checking for existing user:', existingUser);

        if (existingUser) {
            console.warn('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // console.log('Raw password before hashing:', password);
        // const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('Hashed password after hashing:', hashedPassword);

        const user = await User.create({ name, email, password: password });
        console.log('New user created:', user);

        // Generate token
        const token = generateToken(user._id);
        console.log('Token generated for user:', user._id, "is", token);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};



// Login user & get token
const authUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request:', { email });

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user ? { id: user._id, email: user.email } : 'No user found');

        if (user) {
            // Log the stored hashed password for comparison
            console.log('Stored password (hashed):', user.password); 

            const isMatch = await bcrypt.compare(password.trim(), user.password);
            console.log('Password comparison result:', isMatch);
            console.log('Password input:', password); // Log the password input

            if (isMatch) {
                const token = generateToken(user._id);
                console.log('Token generated for user:', user._id);

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false, // Set to true in production
                    sameSite: 'lax',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                });

                console.log('Cookie set successfully');
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                });
            } else {
                console.warn('Invalid password attempt for user:', email);
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            console.warn('No user found with email:', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
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

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is correct, finalize user registration
        user.otp = null; // Clear the OTP
        user.otpExpires = null; // Clear OTP expiration
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Set cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'OTP verified successfully, registration completed.',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};


module.exports = {
    registerUser,
    authUser,
    googleLogin,
    sendOTP,
    verifyOTP,
};