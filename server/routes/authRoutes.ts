import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { createAuthToken } from '../services/authToken.js';

export const authRouter = Router();

// Login / Auto-account creator
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { rollNo, email, role } = req.body;
    if (!rollNo && !email) {
      return res.status(400).json({ error: 'Roll number or Email ID is required' });
    }

    const cleanRoll = rollNo ? String(rollNo).trim().toUpperCase() : '';
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    let user = await UserModel.findOne({
      $or: [{ rollNo: cleanRoll }, { email: cleanEmail }],
    });

    if (!user) {
      // Auto-create on first sign in
      user = await UserModel.create({
        id: `u-${Date.now()}`,
        name: (email || rollNo || 'Student').split('@')[0].replace('.', ' ').toUpperCase(),
        rollNo: cleanRoll || `24CS${Math.floor(100 + Math.random() * 900)}`,
        email: cleanEmail || `${cleanRoll.toLowerCase()}@college.edu.in`,
        branch: 'Computer Science & Engg',
        year: role === 'senior' ? '3rd Year (Senior)' : role === 'admin' ? 'Faculty' : '1st Year (Fresher)',
        role: role || 'student',
        avatar: role === 'senior'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: `${role || 'STUDENT'} | Ready to build with SkillBridge.`,
        badges: [role === 'senior' ? 'Senior Mentor' : role === 'admin' ? 'Admin' : 'Student'],
        reputation: role === 'senior' ? 250 : 30,
      });
    }

    return res.json({ success: true, user, token: createAuthToken(user.toJSON()) });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Register User
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, rollNo, email, branch, year, role, clubName } = req.body;
    if (!name || !rollNo || !email) {
      return res.status(400).json({ error: 'Name, Roll Number, and Email ID are mandatory' });
    }

    const cleanRoll = String(rollNo).trim().toUpperCase();
    const cleanEmail = String(email).trim().toLowerCase();

    const existing = await UserModel.findOne({
      $or: [{ rollNo: cleanRoll }, { email: cleanEmail }],
    });

    if (existing) {
      return res.json({ success: true, user: existing, message: 'Existing profile loaded.' });
    }

    const user = await UserModel.create({
      id: `u-${Date.now()}`,
      name: String(name).trim(),
      rollNo: cleanRoll,
      email: cleanEmail,
      branch: branch || 'Computer Science & Engg',
      year: year || '1st Year (Fresher)',
      role: role || 'student',
      clubName,
      avatar: role === 'senior'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: `${role?.toUpperCase() || 'STUDENT'} | ${branch || 'CSE'} | SkillBridge Scholar.`,
      badges: [role === 'senior' ? 'Senior Mentor' : role === 'admin' ? 'Admin' : 'Student'],
      reputation: role === 'senior' ? 200 : 50,
    });

    return res.status(201).json({ success: true, user, token: createAuthToken(user.toJSON()) });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
authRouter.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().sort({ reputation: -1 });
    return res.json(users);
  } catch (error) {
    console.error('Error in /api/auth/users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
