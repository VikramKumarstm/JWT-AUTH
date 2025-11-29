const userModel = require('../model/userSchema.js')
const emailValidator = require('email-validator')

const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    
    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    const validEmail = emailValidator.validate(email);

    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'please provide a valid email'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'password and confirm password does not match'
        })
    }

    try {
        const userInfo = userModel(req.body);
        
        const result = await userInfo.save();
        
        res.status(200).json({
            success: true,
            message: 'User registered successfully.',
            data: result
        })
        
    } catch (error) {

        if(error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "account already exists with provided email"
            })
        }

        console.log("Error :", error);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
} 

const signin = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'every field is required'
        })
    }

    try {
        const user = await userModel.findOne({email}).select('+password')

        if(!user || user.password !== password) {
            return res.status(400).json({
                success: false,
                message: 'invalid credentials'
            })
        }

        const token = user.jwtToken();
        user.password= undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        };

        res.cookie("token", token, cookieOption)

        res.status(200).json({
            success: true,
            message: 'user login successfully',
            data: user
        })
        
    } catch (error) {

        console.error("ERROR :", error);
        res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}

module.exports = {
    signup,
    signin
}