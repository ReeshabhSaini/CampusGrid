import express from "express";
import supabase from "../config/supabaseClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();


// POST: Register a Student
router.post("/student/register", async (req, res) => {
    const { first_name, last_name, email, password, student_id, branch, semester } = req.body;

    try {
        // Check if the user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from("students")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error(fetchError);
            return res.status(400).json({ status: false, message: "Error checking user existence", error: fetchError });
        }

        if (existingUser) {
            return res.status(409).json({ status: false, message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user data into the database
        const { data, error } = await supabase
            .from("students")
            .insert([
                { first_name, last_name, email, password: hashedPassword, student_id, branch, semester }
            ]);

        if (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: "Error inserting data", error });
        }

        return res.status(200).json({ status: true, message: "Student registered successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server error", err });
    }
});

// POST: Register a Professor
router.post("/professor/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Check if the user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from("professors")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error(fetchError);
            return res.status(400).json({ status: false, message: "Error checking user existence", error: fetchError });
        }

        if (existingUser) {
            return res.status(409).json({ status: false, message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user data into the database
        const { data, error } = await supabase
            .from("professors")
            .insert([
                { first_name, last_name, email, password: hashedPassword }
            ]);

        if (error) {
            console.error(error);
            return res.status(400).json({ status: false, message: "Error inserting data", error });
        }

        return res.status(200).json({ status: true, message: "Professor registered successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server error", err });
    }
});

// POST: Login a user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const requiredData = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role
        }

        return res.status(200).json({ message: "Login successful", token, requiredData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", err });
    }
});

export default router;

