import React from 'react';
import './Manifest.css';
import { Shield, Compass, Wrench, Users } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

const ICONS_MAP = {
  Shield,
  Compass,
  Wrench,
  Users
};

export default function Manifest() {
  const { cmsData } = useCms();
  const { manifest } = cmsData;

  return (
    <section id="manifiesto" className="section section-bg-alt">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">{manifest.title || 'El Código que nos Rige'}</h2>
          <p className="section-desc">
            {manifest.description}
          </p>
        </div>

        <div className="pillars-grid reveal-group">
          {manifest.pillars && manifest.pillars.map((pillar, idx) => {
            const IconComponent = ICONS_MAP[pillar.iconName] || Shield;
            return (
              <div key={idx} className="stealth-card pillar-card">
                <div className="pillar-icon-wrapper">
                  <IconComponent size={24} />
                </div>
                <span className="pillar-number mono">{pillar.number}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-text">{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
