import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.post("/timetable", async (req, res) => {
    const { branch, semester, class_group, tutorial_group, lab_group } = req.body;

    // Validate required query parameters
    if (!branch || !semester || !class_group || !tutorial_group || !lab_group) {
        return res.status(400).json({ message: "Branch, Semester, and all group parameters (class, tutorial, lab) are required." });
    }

    // Log input for debugging
    console.log("Received parameters:", { branch, semester, class_group, tutorial_group, lab_group });

    // Helper function to fetch timetable data
    const fetchTimetable = async (type, group) => {
        return supabase
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
                ),
                type,
                group
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10))
            .eq("type", type)
            .eq("group", group);
    };

    try {
        // Fetch data for all timetable types
        const { data: classes, error: classes_error } = await fetchTimetable("class", class_group);
        const { data: tutorials, error: tutorials_error } = await fetchTimetable("tutorial", tutorial_group);
        const { data: labs, error: labs_error } = await fetchTimetable("lab", lab_group);

        // Log errors if any
        if (classes_error) console.error("Error fetching classes:", classes_error);
        if (tutorials_error) console.error("Error fetching tutorials:", tutorials_error);
        if (labs_error) console.error("Error fetching labs:", labs_error);

        // Return any errors encountered during fetch
        if (classes_error || tutorials_error || labs_error) {
            const errorMessage = classes_error || tutorials_error || labs_error;
            console.error("Error fetching timetable:", errorMessage);
            return res.status(500).json({ message: "Failed to fetch timetable", error: errorMessage });
        }

        // Structure the response
        const response = {
            classes: classes || [],
            tutorials: tutorials || [],
            labs: labs || []
        };

        // Return successful response
        console.log("Fetched timetable data:", response);
        return res.status(200).json({ message: "Timetable fetched successfully", response });

    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});


router.post("/reschedules", async (req, res) => {
    const { branch, semester, class_group, tutorial_group, lab_group } = req.body;

    // Validate required query parameters
    if (!branch || !semester || !class_group || !tutorial_group || !lab_group) {
        return res.status(400).json({ message: "Branch, Semester, and Groups are required." });
    }

    // Log input for debugging
    console.log("Received parameters:", { branch, semester, class_group, tutorial_group, lab_group });

    // Helper function to fetch reschedules for a specific type and group
    const fetchReschedulesByTypeAndGroup = async (type, group) => {
        return supabase
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
                ),
                type,
                group
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10))
            .eq("type", type)
            .eq("group", group);
    };

    try {
        // Fetch reschedules for each type and corresponding group
        const { data: classes, error: classes_error } = await fetchReschedulesByTypeAndGroup("class", class_group);
        const { data: tutorials, error: tutorials_error } = await fetchReschedulesByTypeAndGroup("tutorial", tutorial_group);
        const { data: labs, error: labs_error } = await fetchReschedulesByTypeAndGroup("lab", lab_group);

        // Handle errors for each type
        if (classes_error || tutorials_error || labs_error) {
            const error = classes_error || tutorials_error || labs_error;
            console.error("Error fetching rescheduled classes:", error);
            return res.status(500).json({ message: "Failed to fetch rescheduled classes", error });
        }

        // Log the fetched data for debugging
        console.log("Fetched classes:", classes);
        console.log("Fetched tutorials:", tutorials);
        console.log("Fetched labs:", labs);

        // Return the fetched reschedules as a structured response
        return res.status(200).json({
            message: "Rescheduled classes, tutorials, and labs fetched successfully",
            rescheduled_classes: classes || [],
            rescheduled_tutorials: tutorials || [],
            rescheduled_labs: labs || [],
        });
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

        // Return the fetched holidays
        return res.status(200).json({ message: "Holidays fetched successfully", holidays });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
