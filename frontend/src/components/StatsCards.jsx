import React from 'react';
import { Users, BedDouble, UserCheck, HeartPulse, Stethoscope } from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const cards = [
    {
      label: 'Total Patients',
      value: stats?.total ?? 0,
      icon: Users,
      color: '#0d9488',
      bg: '#ccfbf1',
    },
    {
      label: 'Currently Admitted',
      value: stats?.admitted ?? 0,
      icon: BedDouble,
      color: '#b45309',
      bg: '#fef3c7',
    },
    {
      label: 'Outpatients',
      value: stats?.outpatient ?? 0,
      icon: HeartPulse,
      color: '#0284c7',
      bg: '#e0f2fe',
    },
    {
      label: 'Discharged Records',
      value: stats?.discharged ?? 0,
      icon: UserCheck,
      color: '#15803d',
      bg: '#dcfce7',
    },
    {
      label: 'Specialty Departments',
      value: stats?.departmentCount ?? (stats?.departments?.length || 0),
      icon: Stethoscope,
      color: '#6366f1',
      bg: '#e0e7ff',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="stat-card">
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">
                {loading ? '—' : card.value}
              </div>
            </div>
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: card.bg, color: card.color }}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
