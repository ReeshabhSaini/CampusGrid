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

router.post("/reschedules", async (req, res) => {
    const { branch, semester } = req.body;

    // Validate required query parameters
    if (!branch || !semester) {
        return res.status(400).json({ message: "Branch and Semester are required." });
    }

    try {
        // Fetch data from time_table, courses, and lecture_hall
        const { data: rescheduled_classes, error } = await supabase
            .from("class_rescheduling")
            .select(`
                id,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                original_date,
                rescheduled_date,
                reason,
                new_time,
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
        console.log("Fetched Data:", rescheduled_classes);

        if (rescheduled_classes.length === 0) {
            return res.status(404).json({ message: "No Rescheduled Classes found for the given branch and semester." });
        }

        // Return fetched timetable
        return res.status(200).json({ message: "Timetable fetched successfully", rescheduled_classes });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/holidays", async (req, res) => {
    try {
        const { data: holidays, error } = await supabase
            .from("holidays")
            .select(`
        id,
        holiday_date,
        description
      `);

        if (error) {
            console.error("Error fetching holidays:", error);
            return res.status(500).json({ message: "Failed to fetch holidays", error });
        }

        if (holidays.length === 0) {
            return res.status(404).json({ message: "No holidays found." });
        }

        // Return the fetched holidays
        return res.status(200).json({ message: "Holidays fetched successfully", holidays });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
