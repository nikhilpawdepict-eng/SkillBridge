import { Router, Request, Response } from 'express';
import { ClubModel } from '../models/Club.js';
import { ClubRegistrationModel } from '../models/ClubRegistration.js';

export const clubRouter = Router();

// GET /api/clubs
clubRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const clubs = await ClubModel.find().sort({ memberCount: -1 });
    return res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clubs/:id/events (Add event to a club)
clubRouter.post('/:id/events', async (req: Request, res: Response) => {
  try {
    const { title, date, time, venue, description, bannerImage, registrationLink, tags } = req.body;
    if (!title || !date || !venue) {
      return res.status(400).json({ error: 'Title, date, and venue are mandatory' });
    }

    const club = await ClubModel.findOne({ id: req.params.id });
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    const newEvent = {
      id: `ev-${Date.now()}`,
      clubId: req.params.id,
      title,
      date,
      time: time || '10:00 AM IST',
      venue,
      description: description || 'Campus club workshop/event.',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      registrationLink,
      registrationOpen: true,
      registeredCount: 0,
      tags: tags || ['Event'],
    };

    club.events.unshift(newEvent);
    await club.save();

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding club event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clubs/register (Apply for club membership)
clubRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { clubId, clubName, studentName, rollNo, email, branch, year, interestReason, phone, skills, experience, portfolioLink } = req.body;
    if (!clubId || !studentName || !rollNo || !interestReason || !phone || !skills || !experience) {
      return res.status(400).json({ error: 'Incomplete application data' });
    }

    const registration = await ClubRegistrationModel.create({
      id: `reg-${Date.now()}`,
      clubId,
      clubName,
      studentName,
      rollNo,
      email,
      branch,
      year,
      interestReason,
      phone,
      skills,
      experience,
      portfolioLink,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });

    return res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for club:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clubs/registrations
clubRouter.get('/registrations', async (_req: Request, res: Response) => {
  try {
    const registrations = await ClubRegistrationModel.find().sort({ createdAt: -1 });
    return res.json(registrations);
  } catch (error) {
    console.error('Error fetching club registrations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/clubs/events/:id
clubRouter.delete('/events/:id', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const club = await ClubModel.findOne({ 'events.id': eventId });
    if (!club) {
      return res.status(404).json({ error: 'Event not found' });
    }
    club.events = club.events.filter(ev => ev.id !== eventId);
    await club.save();
    return res.json({ success: true, message: 'Event removed' });
  } catch (error) {
    console.error('Error deleting club event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/clubs/registrations/:id
clubRouter.delete('/registrations/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await ClubRegistrationModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    return res.json({ success: true, message: 'Registration removed' });
  } catch (error) {
    console.error('Error deleting club registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/clubs/registrations/:id/accept
clubRouter.put('/registrations/:id/accept', async (req: Request, res: Response) => {
  try {
    const updated = await ClubRegistrationModel.findOneAndUpdate(
      { id: req.params.id },
      { status: 'accepted' },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error accepting registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

clubRouter.put('/registrations/:id/reject', async (req: Request, res: Response) => {
  try {
    const updated = await ClubRegistrationModel.findOneAndUpdate(
      { id: req.params.id },
      { status: 'reviewed' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Registration not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Error rejecting registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clubs/events/:id/rsvp
clubRouter.post('/events/:id/rsvp', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const updated = await ClubModel.findOneAndUpdate(
      { 'events.id': eventId },
      { $inc: { 'events.$.registeredCount': 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json({ success: true, message: 'RSVP registered successfully' });
  } catch (error) {
    console.error('Error in event RSVP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
