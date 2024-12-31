import express from "express";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

// Utility to add one hour to a time
const addHour = (time) => {
    const [hour, minute, second] = time.split(":").map(Number);
    const newHour = hour + 1;
    return `${newHour.toString().padStart(2, "0")}:${minute}:${second}`;
};

// Endpoint to fetch available time slots
router.post("/get/available/slots", async (req, res) => {
    try {
        const { selectedDate, professorId, branch, semester } = req.body;

        if (!selectedDate || !professorId || !branch || !semester) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const selectedDay = daysOfWeek[new Date(selectedDate).getDay()].toLowerCase();

        console.log(selectedDay);


        const workingHours = [
            { start: "08:00:00", end: "09:00:00" },
            { start: "09:00:00", end: "10:00:00" },
            { start: "10:00:00", end: "11:00:00" },
            { start: "11:00:00", end: "12:00:00" },
            { start: "12:00:00", end: "13:00:00" },
            { start: "13:00:00", end: "14:00:00" },
            { start: "14:00:00", end: "15:00:00" },
            { start: "15:00:00", end: "16:00:00" },
            { start: "16:00:00", end: "17:00:00" },
        ];

        // Fetch professor's busy slots
        const { data: professorBusySlots, error: professorBusyError } = await supabase
            .from("time_table")
            .select("start_time, end_time")
            .eq("day_of_week", selectedDay)
            .eq("professor_id", professorId);

        if (professorBusyError) throw professorBusyError;

        const { data: professorRescheduledSlots, error: professorRescheduleError } = await supabase
            .from("class_rescheduling")
            .select("new_time")
            .eq("rescheduled_date", selectedDate)
            .eq("professor_id", professorId);

        if (professorRescheduleError) throw professorRescheduleError;

        const allProfessorBusySlots = [
            ...professorBusySlots.map(slot => ({ start: slot.start_time, end: slot.end_time })),
            ...professorRescheduledSlots.map(slot => ({ start: slot.new_time, end: addHour(slot.new_time) })),
        ];

        // Fetch student's busy slots
        const { data: studentBusySlots, error: studentBusyError } = await supabase
            .from("time_table")
            .select("start_time, end_time, courses(id)")
            .eq("day_of_week", selectedDay)
            .eq("courses.branch", branch)
            .eq("courses.semester", semester);

        if (studentBusyError) throw studentBusyError;

        const { data: studentRescheduledSlots, error: studentRescheduleError } = await supabase
            .from("class_rescheduling")
            .select("new_time, courses(id)")
            .eq("rescheduled_date", selectedDate)
            .eq("courses.branch", branch)
            .eq("courses.semester", semester);

        if (studentRescheduleError) throw studentRescheduleError;

        const allStudentBusySlots = [
            ...studentBusySlots.map(slot => ({ start: slot.start_time, end: slot.end_time })),
            ...studentRescheduledSlots.map(slot => ({ start: slot.new_time, end: addHour(slot.new_time) })),
        ];

        // Calculate free slots
        const freeSlots = workingHours.filter(slot => {
            const isProfessorFree = allProfessorBusySlots.every(
                busy => slot.end <= busy.start || slot.start >= busy.end
            );
            const isStudentFree = allStudentBusySlots.every(
                busy => slot.end <= busy.start || slot.start >= busy.end
            );
            return isProfessorFree && isStudentFree;
        }).map(slot => `${slot.start} - ${slot.end}`); // Convert objects to strings

        console.log(freeSlots); // Ensure this is an array of objects or strings

        res.status(200).json({ freeSlots });
    } catch (error) {
        console.error("Error fetching available slots:", error.message);
        res.status(500).json({ error: "Failed to fetch available time slots." });
    }
});

// Endpoint to fetch available lecture halls
router.post("/get/available/halls", async (req, res) => {
    try {
        const { selectedDate, selectedTimeSlot } = req.body;

        if (!selectedDate || !selectedTimeSlot) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Convert selected date to day of the week
        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const selectedDay = daysOfWeek[new Date(selectedDate).getDay()];

        console.log(selectedDay);

        // Parse selected time slot to start and end time
        const [startTime, endTime] = selectedTimeSlot.split(" - ");
        if (!startTime || !endTime) {
            return res.status(400).json({ error: "Invalid time slot format." });
        }

        // Get all lecture halls
        const { data: allHalls, error: hallsError } = await supabase
            .from("lecture_halls")
            .select("id, hall_name");

        if (hallsError) throw hallsError;

        // Fetch busy halls from timetable for the selected day and time slot
        const { data: busyHallsFromTimeTable, error: timetableError } = await supabase
            .from("time_table")
            .select("lecture_hall_id")
            .eq("day_of_week", selectedDay)
            .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

        if (timetableError) throw timetableError;

        // Fetch busy halls from rescheduling for the selected date and time slot
        const { data: busyHallsFromRescheduling, error: rescheduleError } = await supabase
            .from("class_rescheduling")
            .select("lecture_hall_id")
            .eq("rescheduled_date", selectedDate)
            .or(`new_time.lt.${endTime},new_time.gt.${startTime}`);

        if (rescheduleError) throw rescheduleError;

        // Combine all busy hall IDs from timetable and rescheduling
        const busyHallIds = new Set([
            ...busyHallsFromTimeTable.map(hall => hall.lecture_hall_id),
            ...busyHallsFromRescheduling.map(hall => hall.lecture_hall_id),
        ]);

        // Filter out the busy halls from all available halls
        const availableHalls = allHalls.filter(hall => !busyHallIds.has(hall.id));

        // Send available halls in the response
        res.status(200).json({
            availableHalls: availableHalls.map(hall => hall.hall_name) // Returning hall names
        });
    } catch (error) {
        console.error("Error fetching available halls:", error.message);
        res.status(500).json({ error: "Failed to fetch available lecture halls." });
    }
});


export default router;
