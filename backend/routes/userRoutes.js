import express from "express";
import crypto from "node:crypto";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/email.js";

const router = express.Router();

//Validates Email
const validEmail = (email) => {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailValid.test(email);
};

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  questionaire: user.questionaire ?? null,
});


//signing up
router.post("/signUP", async (req, res) => {
  try {
    const username = req.body.username; //takes in username, email, and password and sets it to these variables
    const email = req.body.email;
    const password = req.body.password;

    if(!validEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const potentialUser = await User.findOne({username}); //searches MongoDB to see if user exists
    if(potentialUser){
        return res.json({message: "Username already exists"});
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = await new User({ username, email, password, verificationToken }).save();
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: "Account created. Please check your email to verify your account." });
    
  } 
  catch (error) { //error handling
    res.json({ error: error.message });
  }
});


//logging in
router.post("/login", async (req, res) => {
  try {
    const username = req.body.username; //takes in only username and password and sets it to these variables
    const password = req.body.password;

    const potentialUser = await User.findOne({username}); //searches MongoDB to see if user exists
    if(!potentialUser){//if user doesnt exist
        return res.status(404).json({message: "User doesn't exist"});
    }
    if(potentialUser.password !== password){
        return res.status(401).json({message: "Password incorrect"});
    }
    if (!potentialUser.isVerified) {
        return res.status(403).json({ message: "Please verify your email before logging in." });
    }
    res.json({message: "Login successful", user: serializeUser(potentialUser)});
  } 
  catch (error) { //error handling
    res.status(500).json({ error: error.message });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).send("Invalid or expired verification link.");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.send("Email verified! You can now <a href='http://localhost:5173/login'>log in</a>.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
