import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.post("/timetable", async (req, res) => {
    const { branch, semester } = req.body;

    // Validate required query parameters
    if (!branch || !semester) {
        return res.status(400).json({ message: "Branch and Semester are required." });
    }

    try {
        // Fetch data from time_table, courses, and lecture_hall
        const { data: classes, error } = await supabase
            .from("time_table")
            .select(`
                id,
                day_of_week,
                start_time,
                end_time,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                lecture_halls (
                    hall_name
                )
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10));


        if (error) {
            console.error("Error fetching timetable:", error);
            return res.status(500).json({ message: "Failed to fetch timetable", error });
        }

        // Debug: Log data returned by query
        console.log("Fetched Data:", classes);

        if (classes.length === 0) {
            return res.status(404).json({ message: "No timetable found for the given branch and semester." });
        }

        // Return fetched timetable
        return res.status(200).json({ message: "Timetable fetched successfully", classes });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});


export default router;
