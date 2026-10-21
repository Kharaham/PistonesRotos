import React from 'react';
import './History.css';
import { Flag, Image as ImageIcon } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function History() {
  const { cmsData } = useCms();
  const { history } = cmsData;

  const storyText = history.story || (Array.isArray(history.paragraphs) ? history.paragraphs.join(' ') : '');
  const hasTimeline = history.showTimeline !== false && Array.isArray(history.milestones) && history.milestones.length > 0;
  const clubImage = history.image || '/convoy.jpg';

  return (
    <section id="historia" className="section">
      <div className="container">
        <div className={`history-layout ${!hasTimeline ? 'history-layout-no-timeline' : ''}`}>
          {/* Narrative Column */}
          <div className="history-narrative reveal-left">
            <h2 className="section-title history-title">
              {history.title}
            </h2>
            
            <p className="history-subtitle">
              {history.subtitle}
            </p>

            <p className="history-story-text">
              {storyText}
            </p>

            {/* Club Image (when timeline is present, shown here framed) */}
            {hasTimeline && clubImage && (
              <div className="history-image-card stealth-card">
                <img 
                  src={clubImage} 
                  alt="Historia Los Pistones Rotos" 
                  className="history-image"
                  loading="lazy"
                  decoding="async"
                />
                <div className="history-image-overlay">
                  <span className="history-image-tag mono">
                    <ImageIcon size={14} /> FOTOGRAFÍA DE LA HERMANDAD
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Timeline Card OR Featured Large Image (when timeline is hidden) */}
          {hasTimeline ? (
            <div className="stealth-card timeline-card reveal-right">
              <h3 className="timeline-title">
                <Flag size={18} />
                Hitos de la Hermandad
              </h3>

              <div className="timeline-list reveal-group">
                {history.milestones.map((item, idx) => (
                  <div key={item.id || idx} className="timeline-item">
                    <div className="timeline-node mono">
                      {item.year}
                    </div>
                    <div className="timeline-info">
                      <h4 className="timeline-milestone-title">{item.title}</h4>
                      <p className="timeline-milestone-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            clubImage && (
              <div className="history-featured-image-wrapper reveal-right">
                <div className="history-featured-image-card stealth-card">
                  <img 
                    src={clubImage} 
                    alt="Historia Los Pistones Rotos" 
                    className="history-featured-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="history-image-overlay">
                    <span className="history-image-tag mono">
                      <ImageIcon size={14} /> ARCHIVO HISTÓRICO // LOS PISTONES ROTOS
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
