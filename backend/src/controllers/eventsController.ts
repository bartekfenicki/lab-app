import { Request, Response } from "express";
import * as eventModel from "../models/eventsModel.js";
import { AuthRequest } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import { pool } from "../config/db.js";

// ✅ Create an event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, event_start, event_end, assigned_users } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Convert timestamps
    const startTimestamp = new Date(`${date}T${event_start}`);
    const endTimestamp = new Date(`${date}T${event_end}`);
    const eventDate = new Date(date);

    if (!title || !description || !date || !event_start || !event_end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create event
    const event = await eventModel.createEvent({
      created_by: req.user!.user_id,
      company_id: req.user!.company_id,
      title,
      description,
      date: eventDate,
      event_start: startTimestamp,
      event_end: endTimestamp,
      image: imageUrl,
    });

    // Insert into event_users junction table
    if (assigned_users) {
      const users = JSON.parse(assigned_users);
      for (const userId of users) {
        await pool.query(
          "INSERT INTO event_users (event_id, user_id) VALUES ($1, $2)",
          [event.event_id, userId]
        );
      }
    }

    res.json(event);
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};


export const getCompanyEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const events = await eventModel.getAllEvents();

    

    return res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Get all events
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await eventModel.getAllEvents();
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Get single event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.getEventById(Number(req.params.id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// ✅ Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventModel.updateEvent(Number(req.params.id), req.body);
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.json(updatedEvent);
  } catch (err) {
    console.error("❌ Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// ✅ Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const success = await eventModel.deleteEvent(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
