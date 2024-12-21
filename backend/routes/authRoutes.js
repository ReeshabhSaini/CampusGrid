import express from "express"
import supabase from "../config/supabaseClient.js"
import bcrypt from "bcrypt";

const router = express.Router();

// POST: Register a user
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, role, student_id, branch, year } = req.body;

    try {
        // 1. Check if the user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") { // Ignore "row not found" error
            console.error(fetchError);
            return res.status(400).json({ message: "Error checking user existence", error: fetchError });
        }

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 2. Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert user data into the database
        const { data, error } = await supabase
            .from("users")
            .insert([
                { first_name, last_name, email, password: hashedPassword, role, student_id, branch, year }
            ]);

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
