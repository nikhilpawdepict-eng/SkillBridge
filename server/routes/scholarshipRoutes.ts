import { Router, Request, Response } from 'express';
import { ScholarshipModel } from '../models/Scholarship.js';

export const scholarshipRouter = Router();

// GET /api/scholarships
scholarshipRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const scholarships = await ScholarshipModel.find().sort({ createdAt: -1 });
    return res.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/scholarships
scholarshipRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.provider) {
      return res.status(400).json({ error: 'Title and provider are required' });
    }
    const newScholarship = await ScholarshipModel.create({
      id: `sch-${Date.now()}`,
      title: data.title,
      provider: data.provider,
      category: data.category || 'Merit-Based',
      amount: data.amount || '₹50,000',
      deadline: data.deadline || new Date().toISOString().split('T')[0],
      eligibleBranches: data.eligibleBranches || ['All Branches'],
      eligibleYears: data.eligibleYears || ['All Years'],
      cgpaCriteria: data.cgpaCriteria || '7.0+ CGPA',
      description: data.description || 'Scholarship opportunity for students.',
      applicationLink: data.applicationLink || '#',
      officialDriveLink: data.officialDriveLink || '#',
      documentsRequired: data.documentsRequired || ['ID Proof', 'Mark Sheets'],
      status: data.status || 'Open',
    });
    return res.status(201).json(newScholarship);
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/scholarships/:id
scholarshipRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await ScholarshipModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    return res.json({ success: true, message: 'Scholarship removed' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
