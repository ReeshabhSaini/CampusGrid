import express from "express"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

router.post("/get-courses", async (req, res) => {
    try {
        const { branch, semester } = req.body;
        const response = await supabase.from("courses").select("*").eq("branch", branch).eq("semester", parseInt(semester, 10));

        if (response.error) {
            throw response.error;
        }

        res.status(200).json({
            status: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch courses. Please try again.",
        });
    }
});

router.get("/get-lecture-halls", async (req, res) => {
    try {
        const response = await supabase.from("lecture_halls").select("*");

        if (response.error) {
            throw response.error;
        }

        res.status(200).json({
            status: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching lecture halls:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch lecture halls. Please try again.",
        });
    }
});

router.get("/get-professors", async (req, res) => {
    try {
        const response = await supabase.from("professors").select("id, first_name, last_name");

        if (response.error) {
            throw response.error;
        }

        res.status(200).json({
            status: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch professors. Please try again.",
        });
    }
});

router.post("/upload-timetable", async (req, res) => {
    try {
        let { day_of_week, courses_id, start_time, end_time, lecture_hall_id, professor_id } = req.body;

        // Ensure start_time and end_time are in 'time' format
        if (typeof start_time !== 'string' || typeof end_time !== 'string') {
            return res.status(400).json({
                status: false,
                message: "Start time and end time must be in valid string format (HH:mm:ss).",
            });
        }

        // Insert the timetable entry
        const response = await supabase.from("time_table").insert([
            {
                day_of_week,
                courses_id,
                start_time: start_time,
                end_time: end_time,
                lecture_hall_id,
                professor_id,
            },
        ]);

        if (response.error) {
            throw response.error;
        }

        res.status(200).json({
            status: true,
            message: "Timetable entry added successfully!",
        });
    } catch (error) {
        console.error("Error uploading timetable entry:", error);
        res.status(500).json({
            status: false,
            message: "Failed to add timetable entry. Please try again.",
        });
    }
});


router.post("/upload-holidays", async (req, res) => {
    try {
        const { holidays } = req.body;

        // Validate input
        if (!holidays || !Array.isArray(holidays)) {
            return res.status(400).json({
                status: false,
                message: "Invalid input. Please provide an array of holidays.",
            });
        }

        // Insert holidays into the database
        const holidaysData = holidays.map(holiday => ({
            holiday_date: holiday.date,  // Ensure the date format matches the DB (YYYY-MM-DD)
            description: holiday.description,
        }));

        const { data, error } = await supabase
            .from("holidays")
            .insert(holidaysData);

        if (error) {
            throw error;
        }

        res.status(200).json({
            status: true,
            message: "Holidays uploaded successfully!",
        });
    } catch (error) {
        console.error("Error uploading holidays:", error);
        res.status(500).json({
            status: false,
            message: "Failed to upload holidays. Please try again.",
        });
    }
});

export default router;
