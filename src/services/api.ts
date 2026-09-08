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
} from '../types';

const API_BASE = '/api';

export interface ChatApiResponse {
  message: string;
  conversationId: string;
}

export const api = {
  // Auth
  login: async (rollNo: string, email: string, role?: UserRole): Promise<{ success: boolean; user: User; token?: string }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo, email, role }),
    });
    return await res.json();
  },

  register: async (userData: { name: string; rollNo: string; email: string; branch: string; year: string; role: UserRole; clubName?: string }): Promise<{ success: boolean; user: User; token?: string }> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  },

  chat: async (message: string, conversationId: string | undefined, token?: string): Promise<ChatApiResponse> => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, conversationId }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Chat request failed');
    return await res.json();
  },

  clearChat: async (conversationId: string): Promise<void> => {
    await fetch(`${API_BASE}/chat/${encodeURIComponent(conversationId)}`, { method: 'DELETE' });
  },

  // Academic
  getAcademicMaterials: async (filters?: { branch?: string; semester?: number; type?: string; search?: string }): Promise<AcademicMaterial[]> => {
    const params = new URLSearchParams();
    if (filters?.branch) params.append('branch', filters.branch);
    if (filters?.semester) params.append('semester', filters.semester.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);
    const res = await fetch(`${API_BASE}/academic?${params.toString()}`);
    return await res.json();
  },

  addAcademicMaterial: async (mat: Omit<AcademicMaterial, 'id' | 'dateAdded' | 'downloadsCount'>): Promise<AcademicMaterial> => {
    const res = await fetch(`${API_BASE}/academic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mat),
    });
    return await res.json();
  },

  removeAcademicMaterial: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/academic/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  incrementDownload: async (id: string): Promise<AcademicMaterial> => {
    const res = await fetch(`${API_BASE}/academic/${id}/download`, { method: 'POST' });
    return await res.json();
  },

  // Skills
  getSkillResources: async (): Promise<SkillResource[]> => {
    const res = await fetch(`${API_BASE}/skills`);
    return await res.json();
  },

  addSkillResource: async (skill: Omit<SkillResource, 'id' | 'dateAdded' | 'rating'>): Promise<SkillResource> => {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    });
    return await res.json();
  },

  removeSkillResource: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Clubs
  getClubs: async (): Promise<Club[]> => {
    const res = await fetch(`${API_BASE}/clubs`);
    return await res.json();
  },

  addClubEvent: async (clubId: string, event: Omit<ClubEvent, 'id' | 'clubId' | 'registeredCount'>): Promise<ClubEvent> => {
    const res = await fetch(`${API_BASE}/clubs/${clubId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return await res.json();
  },

  removeClubEvent: async (eventId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/clubs/events/${eventId}`, { method: 'DELETE' });
    return await res.json();
  },

  registerForClub: async (reg: Omit<ClubRegistration, 'id' | 'appliedDate' | 'status'>): Promise<ClubRegistration> => {
    const res = await fetch(`${API_BASE}/clubs/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reg),
    });
    return await res.json();
  },

  getClubRegistrations: async (): Promise<ClubRegistration[]> => {
    const res = await fetch(`${API_BASE}/clubs/registrations`);
    return await res.json();
  },

  acceptClubRegistration: async (id: string): Promise<ClubRegistration> => {
    const res = await fetch(`${API_BASE}/clubs/registrations/${id}/accept`, { method: 'PUT' });
    return await res.json();
  },

  rejectClubRegistration: async (id: string): Promise<ClubRegistration> => {
    const res = await fetch(`${API_BASE}/clubs/registrations/${id}/reject`, { method: 'PUT' });
    return await res.json();
  },

  removeClubRegistration: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/clubs/registrations/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  rsvpEvent: async (eventId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/clubs/events/${eventId}/rsvp`, { method: 'POST' });
    return await res.json();
  },

  // Doubts
  getDoubts: async (): Promise<DoubtQuestion[]> => {
    const res = await fetch(`${API_BASE}/doubts`);
    return await res.json();
  },

  postDoubt: async (doubt: Omit<DoubtQuestion, 'id' | 'date' | 'upvotes' | 'solved' | 'replies'>): Promise<DoubtQuestion> => {
    const res = await fetch(`${API_BASE}/doubts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doubt),
    });
    return await res.json();
  },

  removeDoubt: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/doubts/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  replyToDoubt: async (doubtId: string, reply: Omit<DoubtReply, 'id' | 'date' | 'upvotes'>): Promise<DoubtReply> => {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply),
    });
    return await res.json();
  },

  removeReply: async (doubtId: string, replyId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/replies/${replyId}`, { method: 'DELETE' });
    return await res.json();
  },

  verifyReply: async (doubtId: string, replyId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/replies/${replyId}/verify`, { method: 'PUT' });
    return await res.json();
  },

  upvoteDoubt: async (doubtId: string): Promise<{ upvotes: number }> => {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/upvote`, { method: 'POST' });
    return await res.json();
  },

  upvoteReply: async (doubtId: string, replyId: string): Promise<{ upvotes: number }> => {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/replies/${replyId}/upvote`, { method: 'POST' });
    return await res.json();
  },

  // Placements
  getCompanies: async (): Promise<CompanyPlacementInfo[]> => {
    const res = await fetch(`${API_BASE}/placements`);
    return await res.json();
  },

  addCompany: async (company: Omit<CompanyPlacementInfo, 'id'>): Promise<CompanyPlacementInfo> => {
    const res = await fetch(`${API_BASE}/placements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    return await res.json();
  },

  removeCompany: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/placements/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Scholarships
  getScholarships: async (): Promise<Scholarship[]> => {
    const res = await fetch(`${API_BASE}/scholarships`);
    return await res.json();
  },

  addScholarship: async (scholarship: Omit<Scholarship, 'id'>): Promise<Scholarship> => {
    const res = await fetch(`${API_BASE}/scholarships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scholarship),
    });
    return await res.json();
  },

  removeScholarship: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/scholarships/${id}`, { method: 'DELETE' });
    return await res.json();
  },
};
