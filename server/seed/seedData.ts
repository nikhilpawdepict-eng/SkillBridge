import { UserModel } from '../models/User.js';
import { AcademicMaterialModel } from '../models/AcademicMaterial.js';
import { SkillResourceModel } from '../models/SkillResource.js';
import { ClubModel } from '../models/Club.js';
import { DoubtModel } from '../models/Doubt.js';
import { PlacementModel } from '../models/Placement.js';
import { ScholarshipModel } from '../models/Scholarship.js';

import {
  INITIAL_USERS,
  INITIAL_ACADEMIC_MATERIALS,
  INITIAL_SKILL_RESOURCES,
  INITIAL_CLUBS,
  INITIAL_DOUBTS,
  INITIAL_COMPANIES,
  INITIAL_SCHOLARSHIPS,
} from '../../src/data/initialData';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial Users into MongoDB...');
      await UserModel.insertMany(INITIAL_USERS);
    }

    const academicCount = await AcademicMaterialModel.countDocuments();
    if (academicCount === 0) {
      console.log('🌱 Seeding Academic Study Materials into MongoDB...');
      await AcademicMaterialModel.insertMany(INITIAL_ACADEMIC_MATERIALS);
    }

    const skillCount = await SkillResourceModel.countDocuments();
    if (skillCount === 0) {
      console.log('🌱 Seeding Industry Skill Roadmaps into MongoDB...');
      await SkillResourceModel.insertMany(INITIAL_SKILL_RESOURCES);
    }

    const clubCount = await ClubModel.countDocuments();
    if (clubCount === 0) {
      console.log('🌱 Seeding Campus Clubs & Events into MongoDB...');
      await ClubModel.insertMany(INITIAL_CLUBS);
    }

    const doubtCount = await DoubtModel.countDocuments();
    if (doubtCount === 0) {
      console.log('🌱 Seeding Doubt Mentorship Discussions into MongoDB...');
      await DoubtModel.insertMany(INITIAL_DOUBTS);
    }

    const placementCount = await PlacementModel.countDocuments();
    if (placementCount === 0) {
      console.log('🌱 Seeding Placement Guides & Drives into MongoDB...');
      await PlacementModel.insertMany(INITIAL_COMPANIES);
    }

    const scholarshipCount = await ScholarshipModel.countDocuments();
    if (scholarshipCount === 0) {
      console.log('🌱 Seeding Scholarships & Opportunities into MongoDB...');
      await ScholarshipModel.insertMany(INITIAL_SCHOLARSHIPS);
    }

    console.log('✨ MongoDB collections ready & verified! View them in MongoDB Compass.');
  } catch (error) {
    console.error('Error seeding MongoDB collections:', error);
  }
};
