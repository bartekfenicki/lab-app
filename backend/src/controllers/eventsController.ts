import { Request, Response } from "express";
import * as eventModel from "../models/eventsModel.js";

// ✅ Create an event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
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

// ✅ Get a single event by ID
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
