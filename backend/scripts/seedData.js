import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "node:process";
import { pathToFileURL } from "node:url";
import Exercise from "../models/Exercise.js";
import Skill from "../models/Skill.js";

dotenv.config();

export const exercises = [
    { name: "Beginner Bench Press", category: "strength", muscleGroups: ["chest", "arms", "shoulders"], sport: ["racketsports", "football"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds upper-body pressing strength for shoulder stability and powerful swings." },
    { name: "Intermediate Dumbbell Bench Press", category: "strength", muscleGroups: ["chest", "arms", "shoulders"], sport: ["racketsports", "football"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds upper-body pressing strength for shoulder stability and powerful swings." },
    { name: "Advanced Barbell Bench Press", category: "strength", muscleGroups: ["chest", "arms", "shoulders"], sport: ["racketsports", "football"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds upper-body pressing strength for shoulder stability and powerful swings." },
    { name: "Beginner Incline Dumbbell Press", category: "strength", muscleGroups: ["chest", "shoulders", "arms"], sport: ["racketsports", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Targets upper chest and shoulders for overhead and striking movements." },
    { name: "Intermediate Alternating Incline Dumbbell Press", category: "strength", muscleGroups: ["chest", "shoulders", "arms"], sport: ["racketsports", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Targets upper chest and shoulders for overhead and striking movements." },
    { name: "Advanced Heavy Incline Dumbbell Press", category: "strength", muscleGroups: ["chest", "shoulders", "arms"], sport: ["racketsports", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Targets upper chest and shoulders for overhead and striking movements." },
    { name: "Beginner Dumbbell Rows", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "soccer", "football"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Strengthens back and pulling muscles for posture, balance, and control." },
    { name: "Intermediate Single-Arm Dumbbell Rows", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "soccer", "football"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Strengthens back and pulling muscles for posture, balance, and control." },
    { name: "Advanced Renegade Dumbbell Rows", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "soccer", "football"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Strengthens back and pulling muscles for posture, balance, and control." },
    { name: "Beginner Bulgarian Split Squat", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Develops single-leg strength, hip control, and balance." },
    { name: "Intermediate Weighted Bulgarian Split Squat", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Develops single-leg strength, hip control, and balance." },
    { name: "Advanced Jump Bulgarian Split Squat", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Develops single-leg strength, hip control, and balance." },
    { name: "Beginner Step Ups", category: "strength", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds lower-body power through a stable single-leg drive." },
    { name: "Intermediate Lateral Step Ups", category: "strength", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds lower-body power through a stable single-leg drive." },
    { name: "Advanced Explosive Step Ups", category: "strength", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds lower-body power through a stable single-leg drive." },
    { name: "Beginner Glute Bridges", category: "strength", muscleGroups: ["glutes", "legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Activates the glutes and posterior chain for sprinting and jumping." },
    { name: "Intermediate Single-Leg Glute Bridges", category: "strength", muscleGroups: ["glutes", "legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Activates the glutes and posterior chain for sprinting and jumping." },
    { name: "Advanced Weighted Glute Bridges", category: "strength", muscleGroups: ["glutes", "legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Activates the glutes and posterior chain for sprinting and jumping." },
    { name: "Beginner Side Plank", category: "strength", muscleGroups: ["core", "shoulders"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Improves lateral core strength and shoulder stability." },
    { name: "Intermediate Side Plank Hip Dips", category: "strength", muscleGroups: ["core", "shoulders"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Improves lateral core strength and shoulder stability." },
    { name: "Advanced Star Side Plank", category: "strength", muscleGroups: ["core", "shoulders"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Improves lateral core strength and shoulder stability." },
    { name: "Beginner Russian Twists", category: "strength", muscleGroups: ["core"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Trains rotational core control for swings, throws, and kicks." },
    { name: "Intermediate Weighted Russian Twists", category: "strength", muscleGroups: ["core"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Trains rotational core control for swings, throws, and kicks." },
    { name: "Advanced Medicine Ball Russian Twists", category: "strength", muscleGroups: ["core"], sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Trains rotational core control for swings, throws, and kicks." },
    { name: "Beginner Wall Sits", category: "endurance", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds lower-body endurance for staying low and stable." },
    { name: "Intermediate Wall Sit Marches", category: "endurance", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds lower-body endurance for staying low and stable." },
    { name: "Advanced Weighted Wall Sits", category: "endurance", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds lower-body endurance for staying low and stable." },
    { name: "Beginner Box Jumps", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Develops explosive leg power and landing control." },
    { name: "Intermediate Lateral Box Jumps", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Develops explosive leg power and landing control." },
    { name: "Advanced Depth Box Jumps", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Develops explosive leg power and landing control." },
    { name: "Beginner Jump Rope", category: "endurance", muscleGroups: ["legs", "core", "shoulders"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Improves rhythm, conditioning, and quick foot contacts." },
    { name: "Intermediate High-Knee Jump Rope", category: "endurance", muscleGroups: ["legs", "core", "shoulders"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Improves rhythm, conditioning, and quick foot contacts." },
    { name: "Advanced Double-Under Jump Rope", category: "endurance", muscleGroups: ["legs", "core", "shoulders"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Improves rhythm, conditioning, and quick foot contacts." },
    { name: "Beginner Ladder Footwork", category: "agility", muscleGroups: ["legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Trains fast feet, coordination, and body control." },
    { name: "Intermediate Ickey Shuffle Ladder Footwork", category: "agility", muscleGroups: ["legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Trains fast feet, coordination, and body control." },
    { name: "Advanced In-Out Ladder Footwork", category: "agility", muscleGroups: ["legs", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Trains fast feet, coordination, and body control." },
    { name: "Beginner Cone Shuffle", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Improves lateral movement, deceleration, and recovery." },
    { name: "Intermediate T-Drill Cone Shuffle", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Improves lateral movement, deceleration, and recovery." },
    { name: "Advanced Reactive Cone Shuffle", category: "agility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Improves lateral movement, deceleration, and recovery." },
    { name: "Beginner Push Ups", category: "strength", muscleGroups: ["chest", "arms", "shoulders", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds upper-body and core strength using bodyweight." },
    { name: "Intermediate Decline Push Ups", category: "strength", muscleGroups: ["chest", "arms", "shoulders", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds upper-body and core strength using bodyweight." },
    { name: "Advanced Plyometric Push Ups", category: "strength", muscleGroups: ["chest", "arms", "shoulders", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds upper-body and core strength using bodyweight." },
    { name: "Beginner Pull Ups", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Strengthens the back, arms, and shoulders for pulling power." },
    { name: "Intermediate Assisted Tempo Pull Ups", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Strengthens the back, arms, and shoulders for pulling power." },
    { name: "Advanced Weighted Pull Ups", category: "strength", muscleGroups: ["back", "arms", "shoulders"], sport: ["racketsports", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Strengthens the back, arms, and shoulders for pulling power." },
    { name: "Beginner Goblet Squats", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds squat mechanics, leg strength, and trunk control." },
    { name: "Intermediate Tempo Goblet Squats", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds squat mechanics, leg strength, and trunk control." },
    { name: "Advanced Jump Goblet Squats", category: "strength", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds squat mechanics, leg strength, and trunk control." },
    { name: "Beginner Romanian Deadlifts", category: "strength", muscleGroups: ["back", "glutes", "legs"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Strengthens the hamstrings, glutes, and back for hip power." },
    { name: "Intermediate Single-Leg Romanian Deadlifts", category: "strength", muscleGroups: ["back", "glutes", "legs"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Strengthens the hamstrings, glutes, and back for hip power." },
    { name: "Advanced Dumbbell Romanian Deadlifts", category: "strength", muscleGroups: ["back", "glutes", "legs"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Strengthens the hamstrings, glutes, and back for hip power." },
    { name: "Beginner Shoulder Press", category: "strength", muscleGroups: ["shoulders", "arms", "core"], sport: ["racketsports", "volleyball", "football"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Builds overhead strength and shoulder control." },
    { name: "Intermediate Alternating Shoulder Press", category: "strength", muscleGroups: ["shoulders", "arms", "core"], sport: ["racketsports", "volleyball", "football"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Builds overhead strength and shoulder control." },
    { name: "Advanced Push Press", category: "strength", muscleGroups: ["shoulders", "arms", "core"], sport: ["racketsports", "volleyball", "football"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Builds overhead strength and shoulder control." },
    { name: "Beginner Hip Flexor Stretch", category: "flexibility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Improves hip mobility for strides, lunges, and lower-body movement." },
    { name: "Intermediate Kneeling Hip Flexor Stretch", category: "flexibility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Improves hip mobility for strides, lunges, and lower-body movement." },
    { name: "Advanced Couch Hip Flexor Stretch", category: "flexibility", muscleGroups: ["legs", "glutes", "core"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Improves hip mobility for strides, lunges, and lower-body movement." },
    { name: "Beginner Hamstring Stretch", category: "flexibility", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 12, description: "Supports posterior-chain mobility for sprinting, kicking, and low positions." },
    { name: "Intermediate Seated Hamstring Stretch", category: "flexibility", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 8, description: "Supports posterior-chain mobility for sprinting, kicking, and low positions." },
    { name: "Advanced Standing Hamstring Stretch", category: "flexibility", muscleGroups: ["legs", "glutes"], sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Supports posterior-chain mobility for sprinting, kicking, and low positions." },
];

export const skills = [
    { name: "Beginner Dribbling Control", category: "technique", sport: ["soccer"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Dribble slowly with small touches, keeping the ball within one step." },
    { name: "Intermediate Dribbling Control", category: "technique", sport: ["soccer"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Dribble through space using both feet and change speed every few touches." },
    { name: "Advanced Dribbling Control", category: "technique", sport: ["soccer"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Dribble fast while scanning up and keeping tight control." },
    { name: "Beginner Dribbling Direction Changes", category: "technique", sport: ["soccer"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Dribble forward, plant one foot, and cut the ball to a new direction." },
    { name: "Intermediate Dribbling Direction Changes", category: "technique", sport: ["soccer"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Dribble at cones and use inside or outside cuts to turn away." },
    { name: "Advanced Dribbling Direction Changes", category: "technique", sport: ["soccer"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Attack a cone at speed, cut sharply, then accelerate out." },
    { name: "Beginner Dribbling Under Pressure", category: "tactical", sport: ["soccer"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Shield the ball with your body while taking short controlled touches." },
    { name: "Intermediate Dribbling Under Pressure", category: "tactical", sport: ["soccer"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Dribble while a partner shadows you and turn away from pressure." },
    { name: "Advanced Dribbling Under Pressure", category: "tactical", sport: ["soccer"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Hold off a defender, scan, then escape with a quick touch." },
    { name: "Beginner Backhand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Step sideways and swing a backhand slowly without hitting a ball." },
    { name: "Intermediate Backhand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Turn your shoulders, swing through, and recover to ready position." },
    { name: "Advanced Backhand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Shadow a full backhand with footwork, rotation, and quick recovery." },
    { name: "Beginner Forehand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Turn sideways and swing a forehand slowly from low to high." },
    { name: "Intermediate Forehand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Step into the forehand, rotate your hips, and finish across your body." },
    { name: "Advanced Forehand Shadow Swings", category: "technique", sport: ["racketsports"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Move to the ball path, swing fully, then recover fast." },
    { name: "Beginner Serve Follow Through", category: "technique", sport: ["racketsports", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Practice serving motion and finish with your arm reaching forward." },
    { name: "Intermediate Serve Follow Through", category: "technique", sport: ["racketsports", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Serve toward a target and hold a balanced follow-through." },
    { name: "Advanced Serve Follow Through", category: "technique", sport: ["racketsports", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Serve with power, land balanced, and recover into ready stance." },
    { name: "Beginner Hand-Eye Toss Drill", category: "coordination", sport: ["racketsports", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Toss a ball up, track it with your eyes, and catch it softly." },
    { name: "Intermediate Hand-Eye Toss Drill", category: "coordination", sport: ["racketsports", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Toss the ball side to side and catch it while staying balanced." },
    { name: "Advanced Hand-Eye Toss Drill", category: "coordination", sport: ["racketsports", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "React to varied tosses, move your feet, and catch cleanly." },
    { name: "Beginner Split Step Timing", category: "footwork", sport: ["racketsports"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Hop lightly and land in ready stance before moving left or right." },
    { name: "Intermediate Split Step Timing", category: "footwork", sport: ["racketsports"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Split step as your partner signals, then push off quickly." },
    { name: "Advanced Split Step Timing", category: "footwork", sport: ["racketsports"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Time your split step to contact, react, and recover." },
    { name: "Beginner Recovery Footwork", category: "footwork", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Move to a cone, then return to the center ready position." },
    { name: "Intermediate Recovery Footwork", category: "footwork", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Shuffle to each side, plant, and recover to the middle." },
    { name: "Advanced Recovery Footwork", category: "footwork", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Sprint, stop under control, and recover quickly to ready stance." },
    { name: "Beginner Target Passing", category: "technique", sport: ["soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Pass toward a marked target using controlled form." },
    { name: "Intermediate Target Passing", category: "technique", sport: ["soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Pass to different targets and reset your body before each rep." },
    { name: "Advanced Target Passing", category: "technique", sport: ["soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Pass at game speed to moving or smaller targets." },
    { name: "Beginner First Touch Control", category: "technique", sport: ["soccer"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Receive the ball softly and stop it close to your feet." },
    { name: "Intermediate First Touch Control", category: "technique", sport: ["soccer"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Receive a pass and take your first touch into open space." },
    { name: "Advanced First Touch Control", category: "technique", sport: ["soccer"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Control the pass with one touch while turning away from pressure." },
    { name: "Beginner Defensive Positioning", category: "tactical", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Stay low, face the play, and keep space between you and the attacker." },
    { name: "Intermediate Defensive Positioning", category: "tactical", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Shuffle with the attacker and guide them away from the target." },
    { name: "Advanced Defensive Positioning", category: "tactical", sport: ["racketsports", "soccer", "football", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Read the attacker, cut off space, and recover if beaten." },
    { name: "Beginner Serve Placement", category: "tactical", sport: ["racketsports", "volleyball"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "Aim serves at one large target area and repeat your motion." },
    { name: "Intermediate Serve Placement", category: "tactical", sport: ["racketsports", "volleyball"], difficultyLevel: "intermediate", sets: 4, reps: 4, description: "Serve to alternating targets while keeping the same routine." },
    { name: "Advanced Serve Placement", category: "tactical", sport: ["racketsports", "volleyball"], difficultyLevel: "advanced", sets: 5, reps: 5, description: "Call a target, serve with intent, and track your accuracy." },
    { name: "Beginner Ready Position Reset", category: "footwork", sport: ["racketsports", "soccer", "volleyball", "football"], difficultyLevel: "beginner", sets: 3, reps: 3, description: "After each movement, return to bent knees and hands ready." },
];

export const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Exercise.deleteMany({});
        await Skill.deleteMany({});

        await Exercise.insertMany(exercises);
        await Skill.insertMany(skills);

        console.log("Seeded data inserted successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await mongoose.connection.close();
    }
};

const shouldRunDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (shouldRunDirectly) {
  seedData();
}
