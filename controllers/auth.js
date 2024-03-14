const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");

const crypto = require("crypto");
const randomstring = require('randomstring');








exports.userSignup = async(req,res) => {
    try{
        const{name,email,password,confirmPassword} =req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res
              .status(400)
              .json({ message: "Please fill all the required fields!" });
          }
    
    if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password should be at least 8 characters long" });
      }
      if (confirmPassword !== password) {
        return res.status(400).json({ message: "Passwords should match" });
      }
  
      const existingUser = await userSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
       const hashedpw= await bcrypt.hash(password,12);
      const newUser = new userSchema({
        name,
        email,
        password:hashedpw,
      });
  
      const result = await newUser.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
   
};

exports. userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userSchema.findOne({ email });
    if (!findUser) {
      return res.status(500).json({ message: "Please sign up !!" });
    }

    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
      return res.status(500).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ email }, "kuldeep_secret_key", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: "production" });
    res.status(200).json({success: true, message: "User logged In", email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports. resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user with this email" });
    }
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    const token = buffer.toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    const result = await user.save();
  

    res.status(201).json({
      success: true,
      message: "Reset initiated!!!",
      user: result,
    });
  } catch (err) {
    console.error("Error occurred while resetting password:", err);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};



