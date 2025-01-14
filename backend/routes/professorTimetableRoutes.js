import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.post("/timetable", async (req, res) => {
    const { id } = req.body;

    // Validate required query parameters
    if (!id) {
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
                type,
                group,
                courses (
                    id,
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                lecture_halls (
                    id,
                    hall_name
                ),
                professors (
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq("professor_id", id)


        if (error) {
            console.error("Error fetching timetable:", error);
            return res.status(500).json({ message: "Failed to fetch timetable", error });
        }

        // Return fetched timetable
        return res.status(200).json({ message: "Timetable fetched successfully", classes });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/reschedules", async (req, res) => {
    const { id } = req.body;

    // Validate required query parameters
    if (!id) {
        return res.status(400).json({ message: "Branch and Semester are required." });
    }

    try {
        // Fetch data from time_table, courses, and lecture_hall
        const { data: rescheduled_classes, error } = await supabase
            .from("class_rescheduling")
            .select(`
                id,
                type,
                group,
                courses (
                    course_code,
                    course_name,
                    branch,
                    semester
                ),
                original_date,
                rescheduled_date,
                reason,
                new_start_time,
                new_end_time,
                original_start_time,
                original_end_time,
                lecture_halls (
                    id,
                    hall_name
                ),
                professors (
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq("professors.id", id)


        if (error) {
            console.error("Error fetching timetable:", error);
            return res.status(500).json({ message: "Failed to fetch timetable", error });
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

        // Return the fetched holidays
        return res.status(200).json({ message: "Holidays fetched successfully", holidays });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.delete("/cancel-reschedule", async (req, res) => {
    const { rescheduleId } = req.body;

    if (!rescheduleId) {
        return res.status(400).json({ message: "Reschedule ID is required" });
    }

    try {
        // Check if the reschedule exists
        const { data: existingReschedule, error: fetchError } = await supabase
            .from("class_rescheduling")
            .select("*")
            .eq("id", rescheduleId)
            .single();

        if (fetchError) {
            console.error("Error fetching reschedule data:", fetchError);
            return res.status(500).json({ message: "Failed to fetch reschedule", error: fetchError });
        }

        if (!existingReschedule) {
            return res.status(404).json({ message: "Reschedule not found" });
        }

        // Proceed with deleting the reschedule record
        const { error } = await supabase
            .from("class_rescheduling")
            .delete()
            .eq("id", rescheduleId);

        if (error) {
            console.error("Error deleting reschedule:", error);
            return res.status(500).json({ message: "Failed to cancel reschedule", error });
        }

        // Successfully canceled reschedule
        return res.status(200).json({ success: true, message: "Reschedule Canceled" });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
