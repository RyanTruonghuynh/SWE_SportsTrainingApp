import express from 'express';
const router = express.Router();

router.post("/skill-level", async (req, res) =>{
    try{
    const {experienceYears, playsCompetitively, knowsRules, trainingFrequency} = req.body;
    // Simple scoring system based on the provided answers
    let score = 0;

    if (experienceYears >= 2){
        score += 2;
    }
    if (playsCompetitively){
        score += 2;
    } 
    if (knowsRules){
         score += 1;
    }
    if (trainingFrequency >= 4) {
        score += 2;
    }
    else if (trainingFrequency >= 2){
        score += 1;
    }

    //default level is beginner, but can be upgraded to intermediate or advanced based on the score
    let level = "beginner";

    if (score >= 5){
        level = "advanced";
    }
    else if (score >= 3){
        level = "intermediate";
    }

    // Respond with the calculated skill level and the raw score.
    res.json({ skillLevel: level, score });

  } catch (error) {
    // If something goes wrong return a 500 error.
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;