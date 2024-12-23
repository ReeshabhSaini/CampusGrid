import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.get("/timetable", async (req, res) => {
    const { branch, semester } = req.query;

    if (!branch || !semester) {
        return res.status(400).json({ message: "Branch and Semester are required." });
    }

    try {
        // Fetch the timetable from the 'timetables' table based on branch and semester
        const { data, error } = await supabase
            .from("time_table")
            .select("*")
            .eq("branch", branch)
            .eq("semester", semester);

        if (error) {
            console.error("Error fetching timetable:", error);
            return res.status(500).json({ message: "Failed to fetch timetable", error });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No timetable found for the given branch and semester." });
        }

        return res.status(200).json({ message: "Timetable fetched successfully", timetable: data });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
})

export default router;
