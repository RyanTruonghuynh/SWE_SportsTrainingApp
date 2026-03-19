import express from "express";
import User from "../models/User.js";

const router = express.Router();

//signing up
router.post("/signUP", async (req, res) => {
  try {
    const username = req.body.username; //takes in username, email, and password and sets it to these variables
    const email = req.body.email;
    const password = req.body.password;

    const potentialUser = await User.findOne({username}); //searches MongoDB to see if user exists
    if(potentialUser){
        return res.json({message: "Username already exists"});
    }
    else{ //if not, create new user
        await new User({username, password}).save();
        res.json({message: "New user created"});
    }
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
        return res.json({message: "User doesn't exist"});
    }
    if(potentialUser !== password){ //if password is incorrect
        return res.json({message: "Password incorrect"});
    }
    else{ //log in successful
        res.json({message: "Login successful"});
    }
  } 
  catch (error) { //error handling
    res.json({ error: error.message });
  }
});

export default router;