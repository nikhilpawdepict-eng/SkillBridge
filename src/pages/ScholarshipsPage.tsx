import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { DeleteButton } from '../components/DeleteButton';
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FolderArchive,
  Search,
  DollarSign,
  GraduationCap,
} from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { scholarships, addScholarship, removeScholarship } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddScholarshipOpen, setIsAddScholarshipOpen] = useState(false);
  const [scholarshipTitle, setScholarshipTitle] = useState('');
  const [scholarshipProvider, setScholarshipProvider] = useState('');
  const [scholarshipAmount, setScholarshipAmount] = useState('');
  const [scholarshipDeadline, setScholarshipDeadline] = useState('');
  const [scholarshipApplicationLink, setScholarshipApplicationLink] = useState('');
  const [scholarshipDescription, setScholarshipDescription] = useState('');
  const canManageScholarships = currentUser?.role === 'admin';

  const categories = [
    'All',
    'Merit-Based',
    'Need-Based / EWS',
    'Women in STEM',
    'Government Schemes',
    'Corporate CSR',
  ];

  const filteredScholarships = scholarships.filter(sch => {
    const matchCat = selectedCategory === 'All' || sch.category === selectedCategory;
    const matchSearch =
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(245, 158, 11, 0.15) 100%)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 28,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#fbbf24',
            marginBottom: 6,
          }}>
            <Award size={14} /> Student Financial Aid & Grants
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            Scholarships & <span className="gradient-text">Opportunities</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 680, fontSize: '0.95rem' }}>
            Verified national, state, merit, need-based, and corporate scholarships. Review eligibility, prepare documents from drive folders, and apply before deadlines.
          </p>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>₹2,00,000+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Grant per Student</div>
          </div>
        </div>

        {canManageScholarships && (
          <button className="btn btn-primary" onClick={() => setIsAddScholarshipOpen(true)}>
            <Award size={16} /> Add scholarship card
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === cat ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedCategory === cat ? '1px solid var(--accent-amber)' : '1px solid var(--border-glass)',
                color: selectedCategory === cat ? '#080c14' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search scholarship or provider..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Scholarships Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 24,
      }}>
        {filteredScholarships.map(sch => (
          <div
            key={sch.id}
            className="glass-panel"
            style={{
              padding: 24,
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-amber">{sch.category}</span>
                <span className={`badge ${sch.status === 'Open' ? 'badge-emerald' : sch.status === 'Closing Soon' ? 'badge-rose' : 'badge-indigo'}`}>
                  {sch.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: 6, lineHeight: 1.35 }}>
                {sch.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginBottom: 12 }}>
                Provider: {sch.provider}
              </div>

              <div style={{
                background: 'rgba(8, 12, 20, 0.6)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                border: '1px solid var(--border-glass)',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Grant Value:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginTop: 2 }}>
                  {sch.amount}
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                {sch.description}
              </p>

              {/* Eligibility & Dates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="#fb7185" />
                  <span>Deadline: <strong style={{ color: '#fff' }}>{sch.deadline}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <GraduationCap size={14} color="#818cf8" />
                  <span>Criteria: {sch.cgpaCriteria}</span>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  📋 Required Documents:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sch.documentsRequired.map((doc, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#cbd5e1',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      <CheckCircle2 size={10} style={{ display: 'inline', marginRight: 4, color: '#34d399' }} />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTop: '1px solid var(--border-glass)',
              gap: 10,
            }}>
              <a
                href={sch.officialDriveLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <FolderArchive size={14} /> Drive Docs
              </a>

              <a
                href={sch.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <ExternalLink size={14} /> Apply Portal
              </a>
              {canManageScholarships && (
                <DeleteButton label="Remove" onDelete={() => removeScholarship(sch.id)} />
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddScholarshipOpen}
        onClose={() => setIsAddScholarshipOpen(false)}
        title="Add scholarship opportunity"
        subtitle="Give students the details they need to apply with confidence."
      >
        <form onSubmit={e => {
          e.preventDefault();
          if (!scholarshipTitle.trim() || !scholarshipProvider.trim() || !scholarshipApplicationLink.trim()) return;
          addScholarship({
            title: scholarshipTitle.trim(), provider: scholarshipProvider.trim(), category: 'Merit-Based', amount: scholarshipAmount.trim() || 'See official portal',
            deadline: scholarshipDeadline.trim() || 'Check official portal', eligibleBranches: ['All branches'], eligibleYears: ['All years'],
            cgpaCriteria: 'As per official criteria', description: scholarshipDescription.trim() || 'Verified scholarship opportunity for SkillBridge students.',
            applicationLink: scholarshipApplicationLink.trim(), officialDriveLink: scholarshipApplicationLink.trim(), documentsRequired: ['Academic transcripts', 'Identity proof'], status: 'Open',
          });
          setScholarshipTitle(''); setScholarshipProvider(''); setScholarshipAmount(''); setScholarshipDeadline(''); setScholarshipApplicationLink(''); setScholarshipDescription(''); setIsAddScholarshipOpen(false);
        }}>
          <div className="form-group"><label className="form-label">Scholarship title</label><input className="form-control" required value={scholarshipTitle} onChange={e => setScholarshipTitle(e.target.value)} /></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Provider</label><input className="form-control" required value={scholarshipProvider} onChange={e => setScholarshipProvider(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Grant amount</label><input className="form-control" placeholder="e.g. Up to ₹50,000" value={scholarshipAmount} onChange={e => setScholarshipAmount(e.target.value)} /></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Deadline</label><input className="form-control" value={scholarshipDeadline} onChange={e => setScholarshipDeadline(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Application link</label><input className="form-control" type="url" required value={scholarshipApplicationLink} onChange={e => setScholarshipApplicationLink(e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={scholarshipDescription} onChange={e => setScholarshipDescription(e.target.value)} /></div>
          <button className="btn btn-primary" type="submit"><Award size={16} /> Publish scholarship card</button>
        </form>
      </Modal>
    </div>
  );
};
