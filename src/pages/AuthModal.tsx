import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Lock, Mail, Hash, User as UserIcon, ShieldCheck, Sparkles, Building, CheckCircle2, GraduationCap, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const { login, register, switchDemoUser, allUsers } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engg');
  const [year, setYear] = useState('1st Year (Fresher)');
  const [role, setRole] = useState<UserRole>('student');
  const [clubName, setClubName] = useState('');
  const [error, setError] = useState('');

  const branches = [
    'Computer Science & Engg',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Chemical / Other',
  ];

  const years = [
    '1st Year (Fresher)',
    '2nd Year (Sophomore)',
    '3rd Year (Senior)',
    '4th Year (Final Year)',
    'Faculty / Admin',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rollNo.trim()) {
      setError('Please enter your University Roll Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid college or personal Email ID.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'login') {
      const res = await login(rollNo, email, password, role);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        if (onSuccessToast) onSuccessToast(`Welcome back, ${rollNo.toUpperCase()}!`);
        onClose();
      } else {
        setError(res.message || 'Login failed.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your Full Name.');
        return;
      }
      const res = await register({
        name,
        rollNo,
        email,
        branch,
        year,
        role,
        password,
        clubName: role === 'club_admin' ? clubName : undefined,
      });
      if (res.success) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        if (onSuccessToast) onSuccessToast(`Account created successfully! Welcome to SkillBridge.`);
        onClose();
      } else {
        setError(res.message || 'Registration failed.');
      }
    }
  };

  const handleDemoSelect = (userId: string) => {
    switchDemoUser(userId);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    if (onSuccessToast) onSuccessToast('Switched demo profile successfully!');
    onClose();
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'senior':
        return <ShieldCheck size={14} color="#7c3aed" />;
      case 'admin':
        return <Building size={14} color="#dc2626" />;
      case 'club_admin':
        return <Users size={14} color="#0284c7" />;
      default:
        return <GraduationCap size={14} color="#4f46e5" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign in to SkillBridge' : 'Create Student / Mentor Account'}
      subtitle="Access academic drives, peer doubt forum, club events, and AI chatbot"
      maxWidth={580}
    >
      {/* Quick Demo Profile Switcher - Clean ID badges (No user photos) */}
      <div style={{
        background: 'rgba(79, 70, 229, 0.05)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          <Sparkles size={13} /> Quick 1-Click Role Profiles:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
          {allUsers.slice(0, 4).map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleDemoSelect(u.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getRoleIcon(u.role)}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 700 }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role.replace('_', ' ')}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: mode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: mode === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Existing User Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: mode === 'register' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: mode === 'register' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          New Student / Senior Register
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#b91c1c',
          padding: '10px 14px',
          borderRadius: 8,
          fontSize: '0.85rem',
          marginBottom: 16,
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <UserIcon size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">University Roll No</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 24CS042"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                required
              />
              <Hash size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email ID</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="student@college.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Lock size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)' }} />
          </div>
        </div>

        {mode === 'register' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Branch</label>
                <select
                  className="form-control"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select
                  className="form-control"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Role & Privileges</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {[
                  { r: 'student', label: 'Student / Fresher', desc: 'Ask doubts, view material & clubs' },
                  { r: 'senior', label: 'Senior Mentor', desc: 'Upload notes, verify doubts' },
                  { r: 'club_admin', label: 'Club Admin', desc: 'Manage club events & applications' },
                  { r: 'admin', label: 'Institute Admin', desc: 'Full institutional controls' },
                ].map(item => (
                  <div
                    key={item.r}
                    onClick={() => setRole(item.r as UserRole)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: role === item.r ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-secondary)',
                      border: `1px solid ${role === item.r ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: role === item.r ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {item.label}
                      </span>
                      {role === item.r && <CheckCircle2 size={14} color="#4f46e5" />}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {role === 'club_admin' && (
              <div className="form-group">
                <label className="form-label">College Club Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CodeCraft Developers Club / E-Cell"
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 12 }}
        >
          {mode === 'login' ? 'Sign In & Enter SkillBridge' : 'Register Account'}
        </button>

        <div style={{
          marginTop: 16,
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          🛡️ University Auth Node Active • Protected by Institute Role Access Control
        </div>
      </form>
    </Modal>
  );
};
