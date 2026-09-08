import { Router, Request, Response } from 'express';
import { AcademicMaterialModel } from '../models/AcademicMaterial.js';

export const academicRouter = Router();

// GET /api/academic (with filters for branch, semester, type, search)
academicRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { branch, semester, type, search } = req.query;
    const query: Record<string, any> = {};

    if (branch && branch !== 'All') {
      query.$or = [{ branch }, { branch: 'Common / All Branches' }];
    }
    if (semester) {
      query.semester = Number(semester);
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      const q = String(search).trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const materials = await AcademicMaterialModel.find(query).sort({ createdAt: -1 });
    return res.json(materials);
  } catch (error) {
    console.error('Error fetching academic materials:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/academic (Upload study material)
academicRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, branch, semester, subject, type, link, description, authorName, authorRole, authorRollNo, tags } = req.body;
    if (!title || !subject || !link) {
      return res.status(400).json({ error: 'Title, Subject, and Link are required.' });
    }

    const newMaterial = await AcademicMaterialModel.create({
      id: `mat-${Date.now()}`,
      title,
      branch: branch || 'Computer Science & Engg',
      semester: Number(semester) || 1,
      subject,
      type: type || 'drive',
      link,
      description: description || 'Academic notes uploaded by campus senior/mentor.',
      authorName: authorName || 'Senior Mentor',
      authorRole: authorRole || 'senior',
      authorRollNo,
      tags: tags || [subject, `Sem ${semester || 1}`],
      dateAdded: new Date().toISOString().split('T')[0],
      downloadsCount: 1,
    });

    return res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Error creating academic material:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/academic/:id
academicRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await AcademicMaterialModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Material not found' });
    }
    return res.json({ success: true, message: 'Material removed' });
  } catch (error) {
    console.error('Error deleting academic material:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/academic/:id/download (Increment download counter)
academicRouter.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const updated = await AcademicMaterialModel.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Material not found' });
    }
    return res.json(updated);
  } catch (error) {
    console.error('Error incrementing download:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
