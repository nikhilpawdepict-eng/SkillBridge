import React from 'react';
import {
  BookOpen, Users, MessageSquareCode, Bot, Briefcase, Award,
  ArrowRight, Sparkles, ShieldCheck, Download, Compass,
  TrendingUp, CheckCircle, GraduationCap, Building, Hash, Mail, Calendar
} from 'lucide-react';
import { HeroCanvas } from '../components/HeroCanvas';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, openAuthModal }) => {
  const { currentUser, allUsers } = useAuth();
  const { academicMaterials, clubs, doubts, companies, scholarships } = useData();

  const featureCards = [
    { id: 'branch', title: 'Branch Academic Hub', category: 'Academics & Notes', description: 'Handwritten notes, Google Drive folders, question banks, and semester-wise roadmaps for all branches.', icon: BookOpen, badge: 'Curated Notes & PYQs', metrics: `${academicMaterials.length}+ Resources`, cta: 'Explore Branch Hub' },
    { id: 'clubs', title: 'College Clubs & Guilds', category: 'Campus Life', description: 'Join technical, cultural, and robotics clubs. RSVP for hackathons and apply for membership.', icon: Users, badge: 'Active Registrations', metrics: `${clubs.length} Active Clubs`, cta: 'Discover Clubs' },
    { id: 'doubts', title: 'Senior-Fresher Doubt Chat', category: 'Peer Mentorship', description: 'Ask exam, code, and career questions. Get verified answers with Senior Verified badges.', icon: MessageSquareCode, badge: 'Verified Answers', metrics: `${doubts.length}+ Discussions`, cta: 'Open Doubt Forum' },
    { id: 'ai-chatbot', title: '24/7 AI Academic Assistant', category: 'AI Study Partner', description: 'Ask engineering questions, debug code, generate study summaries, and practice interview questions.', icon: Bot, badge: 'Instant AI Answers', metrics: 'Real-time Assistance', cta: 'Start AI Chat' },
    { id: 'placement', title: 'Placement & Company Guide', category: 'Career Acceleration', description: 'Placement drives, CTC packages, eligibility cutoffs, past interview questions, and senior advice.', icon: Briefcase, badge: 'Dream Companies', metrics: `${companies.length}+ Hiring Partners`, cta: 'Browse Placements' },
    { id: 'scholarships', title: 'Scholarships & Grants', category: 'Financial Support', description: 'National, state, merit-based, and women-in-STEM scholarships with eligibility and deadline trackers.', icon: Award, badge: 'Verified Funding', metrics: `${scholarships.length}+ Opportunities`, cta: 'View Scholarships' },
  ];

  const roleCards = [
    {
      title: 'Students & Freshers',
      subtitle: 'Learning & Peer Support',
      icon: GraduationCap,
      permissions: ['Download notes, drive links & solved PYQs', 'Ask questions to seniors in the Doubt Forum', 'RSVP for hackathons and apply to college clubs', 'Browse placements and scholarship opportunities'],
    },
    {
      title: 'Senior Mentors',
      subtitle: 'Guide & Share Knowledge',
      icon: ShieldCheck,
      permissions: ['Upload Google Drive folders, PDFs & notes', 'Answer junior doubts with Senior-Verified solutions', 'Share interview experiences for campus placements', 'Add and remove academic & skill resources'],
    },
    {
      title: 'Club Leads & Admins',
      subtitle: 'Events & Recruitment',
      icon: Users,
      permissions: ['Publish workshops, bootcamps & hackathons', 'Review and accept fresher club applications', 'Remove outdated events and applications', 'Manage club contacts & announcements'],
    },
    {
      title: 'Institute Admin',
      subtitle: 'Full Platform Control',
      icon: Building,
      permissions: ['Add and remove placement company cards', 'Manage scholarship listings', 'Oversee all content across the portal', 'Switch between demo user profiles'],
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-section">
        <HeroCanvas />
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={16} /> Welcome to SkillBridge — Campus Academic Portal
          </div>
          <h1 className="hero-title">
            All Your College <span className="gradient-text">Study Notes, Seniors, Clubs</span> & Placements in One Place
          </h1>
          <p className="hero-subtitle">
            A professional university platform where students find verified Google Drive notes, solve doubts with seniors, join campus clubs, and prepare for top company placements.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <button onClick={() => setActiveTab('branch')} className="btn btn-primary btn-lg">
              <BookOpen size={20} /> Browse Notes & Drive Folders <ArrowRight size={18} />
            </button>
            <button onClick={() => setActiveTab('ai-chatbot')} className="btn btn-secondary btn-lg">
              <Bot size={20} /> Ask AI Study Assistant
            </button>
            {!currentUser && (
              <button onClick={openAuthModal} className="btn btn-secondary btn-lg">Sign In with Roll No</button>
            )}
          </div>
          {currentUser && (
            <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 'var(--radius-full)', background: 'var(--sky-50)', border: '1px solid var(--sky-200)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--sky-600)' }}>Logged in as:</span>
              <strong style={{ color: 'var(--sky-900)' }}>{currentUser.name}</strong>
              <span className="badge">{currentUser.role.toUpperCase()}</span>
              <span style={{ color: 'var(--sky-600)' }}>Roll: {currentUser.rollNo}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3-Step Guide */}
      <section className="section-block" style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--sky-900)' }}>How to Use SkillBridge in 3 Easy Steps</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--sky-700)' }}>Everything you need for college academics and career growth.</p>
        </div>
        <div className="steps-grid">
          {[
            { n: 1, title: 'Find Notes & Exam PYQs', text: 'Go to Branch Hub, select your semester and branch to open Google Drive notes and solved past papers.' },
            { n: 2, title: 'Ask Seniors & AI', text: 'Ask in the Doubt Chat to get answers verified by senior mentors, or chat 24/7 with the AI Tutor.' },
            { n: 3, title: 'Join Clubs & Placements', text: 'Register for hackathons in Clubs, and prepare with interview archives in the Placement Guide.' },
          ].map(step => (
            <div key={step.n} className="step-card">
              <div className="step-number">{step.n}</div>
              <div>
                <h4 style={{ color: 'var(--sky-900)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{step.title}</h4>
                <p style={{ color: 'var(--sky-700)', fontSize: '0.82rem', lineHeight: 1.4 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-row">
        {[
          { label: 'Study Notes & Drive Folders', value: `${academicMaterials.length}+`, icon: Download },
          { label: 'College Clubs & Guilds', value: `${clubs.length} Active`, icon: Users },
          { label: 'Senior-Solved Doubts', value: `${doubts.length}+`, icon: CheckCircle },
          { label: 'Placement Companies', value: `${companies.length}+`, icon: TrendingUp },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-icon"><Icon size={22} /></div>
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Feature Cards */}
      <section style={{ marginBottom: 44 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="page-eyebrow" style={{ justifyContent: 'center' }}>
            <Compass size={14} /> Explore All Platform Sections
          </div>
          <h2 className="section-title">What is Inside SkillBridge?</h2>
          <p style={{ color: 'var(--sky-700)', maxWidth: 580, margin: '0 auto', fontSize: '0.9rem' }}>
            Click any section below to directly open that part of the application.
          </p>
        </div>
        <div className="feature-grid">
          {featureCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="feature-card" onClick={() => setActiveTab(card.id)}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--sky-100)', border: '1px solid var(--sky-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky-600)' }}>
                      <Icon size={22} />
                    </div>
                    <span className="badge">{card.badge}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky-600)', textTransform: 'uppercase', marginBottom: 4 }}>{card.category}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--sky-900)', marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--sky-700)', lineHeight: 1.5, marginBottom: 16 }}>{card.description}</p>
                </div>
                <div className="card-actions">
                  <span style={{ fontSize: '0.8rem', color: 'var(--sky-600)', fontWeight: 600 }}>{card.metrics}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--sky-600)' }}>
                    {card.cta} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Permissions */}
      <section className="section-block">
        <h2 className="section-title">Who Can Do What on SkillBridge?</h2>
        <p className="section-subtitle">Permissions and features tailored for every user role on the platform.</p>
        <div className="role-grid">
          {roleCards.map(role => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="role-card">
                <div className="role-card-header">
                  <div className="role-icon-box"><Icon size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--sky-900)' }}>{role.title}</h4>
                    <div style={{ fontSize: '0.72rem', color: 'var(--sky-600)' }}>{role.subtitle}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--sky-700)' }}>
                  {role.permissions.map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle size={15} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Users Info */}
      <section className="section-block">
        <h2 className="section-title">Demo User Profiles</h2>
        <p className="section-subtitle">Switch between these profiles using the role switcher in the navigation bar.</p>
        <div className="card-grid">
          {allUsers.map(user => (
            <div key={user.id} className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sky-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--sky-900)' }}>{user.name}</div>
                  <span className="badge">{user.role.toUpperCase()}</span>
                </div>
              </div>
              <div className="user-info-panel">
                <div className="user-info-row">
                  <span className="user-info-label"><Hash size={12} /> Roll No</span>
                  <span className="user-info-value">{user.rollNo}</span>
                </div>
                <div className="user-info-row">
                  <span className="user-info-label"><Mail size={12} /> Email</span>
                  <span className="user-info-value">{user.email}</span>
                </div>
                <div className="user-info-row">
                  <span className="user-info-label"><BookOpen size={12} /> Branch</span>
                  <span className="user-info-value">{user.branch}</span>
                </div>
                <div className="user-info-row">
                  <span className="user-info-label"><Calendar size={12} /> Year</span>
                  <span className="user-info-value">{user.year}</span>
                </div>
                {user.clubName && (
                  <div className="user-info-row">
                    <span className="user-info-label"><Users size={12} /> Club</span>
                    <span className="user-info-value">{user.clubName}</span>
                  </div>
                )}
                {user.reputation !== undefined && (
                  <div className="user-info-row">
                    <span className="user-info-label"><Sparkles size={12} /> Reputation</span>
                    <span className="user-info-value">{user.reputation} pts</span>
                  </div>
                )}
                {user.bio && (
                  <div className="user-info-row" style={{ flexDirection: 'column', gap: 4 }}>
                    <span className="user-info-label">Bio</span>
                    <span className="user-info-value" style={{ fontWeight: 400, fontSize: '0.8rem' }}>{user.bio}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
