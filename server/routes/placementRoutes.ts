import { Router, Request, Response } from 'express';
import { PlacementModel } from '../models/Placement.js';

export const placementRouter = Router();

// GET /api/placements
placementRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const placements = await PlacementModel.find().sort({ createdAt: -1 });
    return res.json(placements);
  } catch (error) {
    console.error('Error fetching placement data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/placements
placementRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ error: 'Company name is required' });
    }
    const newCompany = await PlacementModel.create({
      id: `co-${Date.now()}`,
      name: data.name,
      logo: data.logo || 'https://via.placeholder.com/80',
      tier: data.tier || 'Standard (6-12 LPA)',
      packageLPA: data.packageLPA || '8 LPA',
      eligibleBranches: data.eligibleBranches || ['All Branches'],
      hiringRounds: data.hiringRounds || ['Online Test', 'Technical', 'HR'],
      prepRoadmapLink: data.prepRoadmapLink || '#',
      driveLink: data.driveLink || '#',
      overview: data.overview || 'Campus hiring drive.',
      importantTopics: data.importantTopics || ['DSA', 'Core CS'],
      recentInterviewExperiences: data.recentInterviewExperiences || [],
    });
    return res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating placement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/placements/:id
placementRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await PlacementModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Company not found' });
    }
    return res.json({ success: true, message: 'Company removed' });
  } catch (error) {
    console.error('Error deleting placement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
