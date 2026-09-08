import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AcademicMaterial,
  SkillResource,
  Club,
  ClubEvent,
  ClubRegistration,
  DoubtQuestion,
  DoubtReply,
  CompanyPlacementInfo,
  Scholarship,
  User,
  UserRole,
} from '../src/types';
import {
  INITIAL_USERS,
  INITIAL_ACADEMIC_MATERIALS,
  INITIAL_SKILL_RESOURCES,
  INITIAL_CLUBS,
  INITIAL_DOUBTS,
  INITIAL_COMPANIES,
  INITIAL_SCHOLARSHIPS,
} from '../src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  academicMaterials: AcademicMaterial[];
  skillResources: SkillResource[];
  clubs: Club[];
  clubRegistrations: ClubRegistration[];
  doubts: DoubtQuestion[];
  companies: CompanyPlacementInfo[];
  scholarships: Scholarship[];
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading database file, re-initializing with seed data:', err);
    }

    // Initialize with rich pre-populated seed data
    const initialDb: DatabaseSchema = {
      users: INITIAL_USERS,
      academicMaterials: INITIAL_ACADEMIC_MATERIALS,
      skillResources: INITIAL_SKILL_RESOURCES,
      clubs: INITIAL_CLUBS,
      clubRegistrations: [],
      doubts: INITIAL_DOUBTS,
      companies: INITIAL_COMPANIES,
      scholarships: INITIAL_SCHOLARSHIPS,
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // ==========================================
  // USERS & AUTH METHODS
  // ==========================================
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByRollOrEmail(rollNo: string, email: string): User | undefined {
    const cleanRoll = rollNo.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    return this.data.users.find(
      u => u.rollNo.toUpperCase() === cleanRoll || u.email.toLowerCase() === cleanEmail
    );
  }

  public createUser(userData: {
    name: string;
    rollNo: string;
    email: string;
    branch: string;
    year: string;
    role: UserRole;
    clubName?: string;
  }): User {
    const cleanRoll = userData.rollNo.trim().toUpperCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name.trim(),
      rollNo: cleanRoll,
      email: cleanEmail,
      branch: userData.branch,
      year: userData.year,
      role: userData.role,
      clubName: userData.clubName,
      avatar: userData.role === 'senior'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : userData.role === 'admin'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: `${userData.role.toUpperCase()} | ${userData.branch} | SkillBridge Scholar.`,
      badges: [userData.role === 'senior' ? 'Senior Mentor' : userData.role === 'admin' ? 'Admin' : 'Student'],
      reputation: userData.role === 'senior' ? 250 : 30,
    };

    this.data.users.unshift(newUser);
    this.saveDatabase();
    return newUser;
  }

  // ==========================================
  // ACADEMIC MATERIALS
  // ==========================================
  public getAcademicMaterials(filters?: { branch?: string; semester?: number; type?: string; search?: string }): AcademicMaterial[] {
    let result = this.data.academicMaterials;

    if (filters?.branch && filters.branch !== 'All') {
      result = result.filter(m => m.branch === filters.branch || m.branch === 'Common / All Branches');
    }
    if (filters?.semester) {
      result = result.filter(m => m.semester === Number(filters.semester));
    }
    if (filters?.type && filters.type !== 'All') {
      result = result.filter(m => m.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        m => m.title.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public addAcademicMaterial(mat: Omit<AcademicMaterial, 'id' | 'dateAdded' | 'downloadsCount'>): AcademicMaterial {
    const newMat: AcademicMaterial = {
      ...mat,
      id: `mat-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadsCount: 1,
    };
    this.data.academicMaterials.unshift(newMat);
    this.saveDatabase();
    return newMat;
  }

  public incrementMaterialDownload(id: string): AcademicMaterial | null {
    const mat = this.data.academicMaterials.find(m => m.id === id);
    if (mat) {
      mat.downloadsCount += 1;
      this.saveDatabase();
      return mat;
    }
    return null;
  }

  // ==========================================
  // SKILL RESOURCES
  // ==========================================
  public getSkillResources(filters?: { category?: string; level?: string; type?: string; search?: string }): SkillResource[] {
    let result = this.data.skillResources;

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters?.level && filters.level !== 'All') {
      result = result.filter(s => s.level === filters.level);
    }
    if (filters?.type && filters.type !== 'All') {
      result = result.filter(s => s.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public addSkillResource(res: Omit<SkillResource, 'id' | 'dateAdded' | 'rating'>): SkillResource {
    const newRes: SkillResource = {
      ...res,
      id: `sk-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      rating: 5.0,
    };
    this.data.skillResources.unshift(newRes);
    this.saveDatabase();
    return newRes;
  }

  // ==========================================
  // CLUBS & EVENTS
  // ==========================================
  public getClubs(): Club[] {
    return this.data.clubs;
  }

  public addClubEvent(clubId: string, eventData: Omit<ClubEvent, 'id' | 'clubId' | 'registeredCount'>): ClubEvent | null {
    const club = this.data.clubs.find(c => c.id === clubId);
    if (!club) return null;

    const newEvent: ClubEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      clubId,
      registeredCount: 0,
    };

    club.events.unshift(newEvent);
    this.saveDatabase();
    return newEvent;
  }

  public getClubRegistrations(): ClubRegistration[] {
    return this.data.clubRegistrations;
  }

  public registerForClub(regData: Omit<ClubRegistration, 'id' | 'appliedDate' | 'status'>): ClubRegistration {
    const newReg: ClubRegistration = {
      ...regData,
      id: `reg-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    this.data.clubRegistrations.unshift(newReg);
    this.saveDatabase();
    return newReg;
  }

  public rsvpEvent(eventId: string): boolean {
    let found = false;
    for (const club of this.data.clubs) {
      const ev = club.events.find(e => e.id === eventId);
      if (ev) {
        ev.registeredCount += 1;
        found = true;
        break;
      }
    }
    if (found) this.saveDatabase();
    return found;
  }

  // ==========================================
  // DOUBTS & MENTORSHIP
  // ==========================================
  public getDoubts(): DoubtQuestion[] {
    return this.data.doubts;
  }

  public postDoubt(doubt: Omit<DoubtQuestion, 'id' | 'date' | 'upvotes' | 'solved' | 'replies'>): DoubtQuestion {
    const newDoubt: DoubtQuestion = {
      ...doubt,
      id: `d-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0,
      solved: false,
      replies: [],
    };
    this.data.doubts.unshift(newDoubt);
    this.saveDatabase();
    return newDoubt;
  }

  public replyToDoubt(doubtId: string, reply: Omit<DoubtReply, 'id' | 'date' | 'upvotes'>): DoubtReply | null {
    const doubt = this.data.doubts.find(d => d.id === doubtId);
    if (!doubt) return null;

    const isSeniorVerified = reply.authorRole === 'senior' || reply.authorRole === 'admin';
    const newReply: DoubtReply = {
      ...reply,
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0,
      isSeniorVerified,
    };

    doubt.replies.push(newReply);
    if (isSeniorVerified) doubt.solved = true;

    this.saveDatabase();
    return newReply;
  }

  public verifyReply(doubtId: string, replyId: string): boolean {
    const doubt = this.data.doubts.find(d => d.id === doubtId);
    if (!doubt) return false;

    const reply = doubt.replies.find(r => r.id === replyId);
    if (reply) {
      reply.isSeniorVerified = true;
      doubt.solved = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public upvoteDoubt(doubtId: string): number | null {
    const doubt = this.data.doubts.find(d => d.id === doubtId);
    if (doubt) {
      doubt.upvotes += 1;
      this.saveDatabase();
      return doubt.upvotes;
    }
    return null;
  }

  public upvoteReply(doubtId: string, replyId: string): number | null {
    const doubt = this.data.doubts.find(d => d.id === doubtId);
    if (!doubt) return null;
    const reply = doubt.replies.find(r => r.id === replyId);
    if (reply) {
      reply.upvotes += 1;
      this.saveDatabase();
      return reply.upvotes;
    }
    return null;
  }

  // ==========================================
  // PLACEMENTS & SCHOLARSHIPS
  // ==========================================
  public getCompanies(): CompanyPlacementInfo[] {
    return this.data.companies;
  }

  public getScholarships(): Scholarship[] {
    return this.data.scholarships;
  }
}

export const db = new Database();
