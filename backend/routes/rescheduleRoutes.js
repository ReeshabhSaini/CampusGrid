import express from "express";
import supabase from "../config/supabaseClient.js";
const router = express.Router();

// Endpoint to fetch available time slots
router.post("/get/available/slots", async (req, res) => {
    try {
        const { selectedDate, professorId, branch, semester } = req.body;

        if (!selectedDate || !professorId || !branch || !semester) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const selectedDay = daysOfWeek[new Date(selectedDate).getDay()].toLowerCase();

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
            .select("new_start_time, new_end_time")
            .eq("rescheduled_date", selectedDate)
            .eq("professor_id", professorId);

        if (professorRescheduleError) throw professorRescheduleError;

        const allProfessorBusySlots = [
            ...professorBusySlots.map(slot => ({ start: slot.start_time, end: slot.end_time })),
            ...professorRescheduledSlots.map(slot => ({ start: slot.new_start_time, end: slot.new_end_time })),
        ];

        // Fetch student's busy slots
        const { data: studentBusySlots, error: studentBusyError } = await supabase
            .from("time_table")
            .select("start_time, end_time, courses(id, branch, semester)")
            .eq("day_of_week", selectedDay)
            .eq("courses.branch", branch)
            .eq("courses.semester", semester);

        if (studentBusyError) throw studentBusyError;

        const { data: studentRescheduledSlots, error: studentRescheduleError } = await supabase
            .from("class_rescheduling")
            .select("new_start_time, new_end_time, courses(id, branch, semester)")
            .eq("rescheduled_date", selectedDate)
            .eq("courses.branch", branch)
            .eq("courses.semester", semester);

        if (studentRescheduleError) throw studentRescheduleError;

        const allStudentBusySlots = [
            ...studentBusySlots.map(slot => ({ start: slot.start_time, end: slot.end_time })),
            ...studentRescheduledSlots.map(slot => ({ start: slot.new_start_time, end: slot.new_end_time })),
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
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const selectedDay = daysOfWeek[new Date(selectedDate).getDay()];

        // Parse selected time slot into start and end times
        const [startTime, endTime] = selectedTimeSlot.split(" - ");
        if (!startTime || !endTime) {
            return res.status(400).json({ error: "Invalid time slot format." });
        }

        // Fetch all lecture halls
        const { data: allHalls, error: hallsError } = await supabase
            .from("lecture_halls")
            .select("id, hall_name");

        if (hallsError) throw hallsError;

        // Fetch busy halls from the timetable for the selected day and time slot
        const { data: busyHallsStartOverlap, error: startOverlapError } = await supabase
            .from("time_table")
            .select("lecture_hall_id")
            .eq("day_of_week", selectedDay)
            .lte("start_time", startTime)
            .gt("end_time", startTime);

        if (startOverlapError) throw startOverlapError;

        const { data: busyHallsEndOverlap, error: endOverlapError } = await supabase
            .from("time_table")
            .select("lecture_hall_id")
            .eq("day_of_week", selectedDay)
            .lt("start_time", endTime)
            .gte("end_time", endTime);

        if (endOverlapError) throw endOverlapError;

        const { data: busyHallsWithinSlot, error: withinSlotError } = await supabase
            .from("time_table")
            .select("lecture_hall_id")
            .eq("day_of_week", selectedDay)
            .gte("start_time", startTime)
            .lte("end_time", endTime);

        if (withinSlotError) throw withinSlotError;

        // Combine all busy halls from timetable
        const busyHallsFromTimeTable = [
            ...busyHallsStartOverlap,
            ...busyHallsEndOverlap,
            ...busyHallsWithinSlot,
        ];

        // Fetch busy halls from rescheduling for the selected date and time slot
        const { data: busyHallsRescheduleStartOverlap, error: rescheduleStartError } = await supabase
            .from("class_rescheduling")
            .select("lecture_hall_id")
            .eq("rescheduled_date", selectedDate)
            .lte("new_start_time", startTime)
            .gt("new_end_time", startTime);

        if (rescheduleStartError) throw rescheduleStartError;

        const { data: busyHallsRescheduleEndOverlap, error: rescheduleEndError } = await supabase
            .from("class_rescheduling")
            .select("lecture_hall_id")
            .eq("rescheduled_date", selectedDate)
            .lt("new_start_time", endTime)
            .gte("new_end_time", endTime);

        if (rescheduleEndError) throw rescheduleEndError;

        const { data: busyHallsRescheduleWithinSlot, error: rescheduleWithinSlotError } = await supabase
            .from("class_rescheduling")
            .select("lecture_hall_id")
            .eq("rescheduled_date", selectedDate)
            .gte("new_start_time", startTime)
            .lte("new_end_time", endTime);

        if (rescheduleWithinSlotError) throw rescheduleWithinSlotError;

        // Combine all busy halls from rescheduling
        const busyHallsFromRescheduling = [
            ...busyHallsRescheduleStartOverlap,
            ...busyHallsRescheduleEndOverlap,
            ...busyHallsRescheduleWithinSlot,
        ];

        // Combine all busy hall IDs from timetable and rescheduling
        const busyHallIds = new Set([
            ...busyHallsFromTimeTable.map(hall => hall.lecture_hall_id),
            ...busyHallsFromRescheduling.map(hall => hall.lecture_hall_id),
        ]);

        // Filter out the busy halls from all available halls
        const availableHalls = allHalls
            .filter(hall => !busyHallIds.has(hall.id))
            .map(hall => hall.hall_name)
            .sort((a, b) => a.localeCompare(b)); // Sort lexicographically

        // Send available halls in the response
        res.status(200).json({
            availableHalls, // Returning hall names in lexicographical order
        });
    } catch (error) {
        console.error("Error fetching available halls:", error.message);
        res.status(500).json({ error: "Failed to fetch available lecture halls." });
    }
});


router.post('/reschedule/request', async (req, res) => {
    const {
        course_id,
        original_date,
        rescheduled_date,
        reason,
        professor_id,
        lecture_hall,
        selected_time,
        type,
        group,
        original_start_time,
        original_end_time
    } = req.body;

    // Validate the request body
    if (
        !course_id ||
        !original_date ||
        !rescheduled_date ||
        !reason ||
        !professor_id ||
        !lecture_hall ||
        !selected_time ||
        !type ||
        !group ||
        !original_start_time ||
        !original_end_time
    ) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Parse selected time slot to start and end time
    const [new_start_time, new_end_time] = selected_time.split(" - ");
    if (!new_start_time || !new_end_time) {
        return res.status(400).json({ error: "Invalid time slot format." });
    }

    try {
        // Fetch lecture hall ID based on hall name
        const { data: lectureHalls, error: hallError } = await supabase
            .from("lecture_halls")
            .select("id")
            .eq("hall_name", lecture_hall)
            .single(); // Ensure we get only one result

        if (hallError || !lectureHalls) {
            console.error('Error fetching lecture hall:', hallError);
            return res.status(400).json({ error: 'Invalid lecture hall name.' });
        }

        const lecture_hall_id = lectureHalls.id;

        // Insert the rescheduling request into the database
        const { data, error } = await supabase
            .from('class_rescheduling')
            .insert([
                {
                    course_id,
                    original_date,
                    rescheduled_date,
                    reason,
                    professor_id,
                    lecture_hall_id,
                    new_start_time,
                    new_end_time,
                    type,
                    group,
                    original_start_time,
                    original_end_time
                },
            ])
            .select('id'); // Return the inserted ID

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Failed to add reschedule request.' });
        }

        res.status(201).json({
            success: true,
            message: 'Class Rescheduled.',
            rescheduleId: data[0].id,
        });
    } catch (error) {
        console.error('Unexpected error inserting reschedule request:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

export default router;
