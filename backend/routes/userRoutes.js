import express from "express";
import User from "../models/User.js";

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
     //if not, create new user
    const newUser = await new User({username, email, password}).save();
    res.status(201).json({message: "New user created", user: serializeUser(newUser)});
    
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
    if(potentialUser.password !== password){ //if password is incorrect
        return res.status(401).json({message: "Password incorrect"});
    }
    else{ //log in successful
        res.json({message: "Login successful", user: serializeUser(potentialUser)});
    }
  } 
  catch (error) { //error handling
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
