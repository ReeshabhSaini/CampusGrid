import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

// POST: Register a user
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, role, student_id, branch, year } = req.body;

    try {
        // Insert user data into Supabase table 'users'
        const { data, error } = await supabase
            .from("users")
            .insert([{ first_name, last_name, email, password, role, student_id, branch, year }]);

        if (error) {
            console.error(error);
            return res.status(400).json({ message: "Error inserting data", error });
        }

        return res.status(200).json({ message: "User registered successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", err });
    }
});

export default router;
