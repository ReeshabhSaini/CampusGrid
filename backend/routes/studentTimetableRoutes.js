import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.post("/timetable", async (req, res) => {
    const { branch, semester, class_group, tutorial_group, lab_group } = req.body;

    // Validate required query parameters
    if (!branch || !semester || !class_group || !tutorial_group || !lab_group) {
        return res.status(400).json({ message: "Branch and Semester are required." });
    }

    console.log(class_group);
    console.log(tutorial_group);
    console.log(lab_group);

    try {
        // Fetch classes from time_table, courses, and lecture_hall
        const { data: classes, classes_error } = await supabase
            .from("time_table")
            .select(`
                id,
                day_of_week,
                start_time,
                end_time,
                type,
                group,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                lecture_halls (
                    hall_name
                ),
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10))
            .eq("type", "class")
            .eq("group", class_group)

        console.log(classes);

        // Fetch tutorials from time_table, courses, and lecture_hall
        const { data: tutorials, tutorials_error } = await supabase
            .from("time_table")
            .select(`
                id,
                day_of_week,
                start_time,
                end_time,
                type,
                group,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                lecture_halls (
                    hall_name
                ),
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10))
            .eq("type", "tutorial")
            .eq("group", tutorial_group)

        console.log(tutorials);

        // Fetch labs from time_table, courses, and lecture_hall
        const { data: labs, labs_error } = await supabase
            .from("time_table")
            .select(`
                id,
                day_of_week,
                start_time,
                end_time,
                type,
                group,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                lecture_halls (
                    hall_name
                ),
            `)
            .eq("courses.branch", branch)
            .eq("courses.semester", parseInt(semester, 10))
            .eq("type", "lab")
            .eq("group", lab_group)

        console.log(labs);


        if (classes_error || tutorials_error || labs_error) {
            const error = (classes_error || tutorials_error || labs_error);
            console.error("Error fetching timetable:", error);
            return res.status(500).json({ message: "Failed to fetch timetable", error });
        }

        const response = { classes, tutorials, labs }

        console.log(response);

        // Return fetched timetable
        return res.status(200).json({ message: "Timetable fetched successfully", response });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// router.post("/reschedules", async (req, res) => {
//     const { branch, semester, class_group, tutorial_group, lab_group } = req.body;

//     // Validate required query parameters
//     if (!branch || !semester || !class_group || !tutorial_group || !lab_group) {
//         return res.status(400).json({ message: "Branch and Semester are required." });
//     }

//     try {
//         // Fetch data from time_table, courses, and lecture_hall
//         const { data: rescheduled_classes, error } = await supabase
//             .from("class_rescheduling")
//             .select(`
//                 id,
//                 courses (
//                     course_code,
//                     course_name,
//                     branch,
//                     semester
//                 ),
//                 original_date,
//                 rescheduled_date,
//                 reason,
//                 new_time,
//                 lecture_halls (
//                 hall_name
//                 )
//             `)
//             .eq("courses.branch", branch)
//             .eq("courses.semester", parseInt(semester, 10))
//             .eq("class_group", class_group)
//             .eq("tutorial_group", tutorial_group)
//             .eq("lab_group", lab_group);


//         if (error) {
//             console.error("Error fetching timetable:", error);
//             return res.status(500).json({ message: "Failed to fetch timetable", error });
//         }

//         // Debug: Log data returned by query
//         console.log("Fetched Data:", rescheduled_classes);

//         // Return fetched timetable
//         return res.status(200).json({ message: "Timetable fetched successfully", rescheduled_classes });
//     } catch (err) {
//         console.error("Server Error:", err);
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// });

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
