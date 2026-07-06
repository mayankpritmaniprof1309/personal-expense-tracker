const user=require("../models/User");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");
dotenv.config()

//Register user
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET,{
        expiresIn: '30d', // Token expiration time
    });
};

async function registerUser(req, res) {
    try {
        const { name, email, password, contact } = req.body;

        // Check if the user already exists
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create a new user
        const newUser = new user({
            name,
            email,
            password, // Hashed by pre-save hook
            contact
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = generateToken(existingUser._id);

        // Set token as an httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
            sameSite: "strict", // use "none" instead if frontend/backend are on different domains
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, match this to your JWT expiry
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

async function users(req, res) {
    try {
        const allUsers = await user.find({});
        res.status(200).json({ message: "Users retrieved successfully", users: allUsers });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
}

function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).send({message:"User Logged Out Successfully !!"})
};
module.exports = { registerUser, loginUser, users };
