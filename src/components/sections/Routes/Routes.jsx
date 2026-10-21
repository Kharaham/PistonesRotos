import React, { useState, useEffect, useRef } from 'react';
import './Routes.css';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { ROUTE_CATEGORIES } from '../../../data/routesData';

export default function Routes({ onSelectRoute }) {
  const { cmsData } = useCms();
  const [filter, setFilter] = useState('todas');
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const gridRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && gridRef.current) {
        gridRef.current.scrollLeft = 0;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routes = cmsData.routes || [];

  const filteredRoutes = filter === 'todas'
    ? routes
    : routes.filter((r) => r.category === filter);

  // Force scroll to start on the first card whenever filter or routes update on mobile
  useEffect(() => {
    if (isMobile && gridRef.current) {
      gridRef.current.scrollLeft = 0;
      setActiveMobileCard(0);
    }
  }, [filter, isMobile, filteredRoutes.length]);

  const handleMobileScroll = (e) => {
    const el = e.target;
    if (!el || !el.firstElementChild) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild.offsetWidth;
    const gap = 20; // 1.25rem = 20px
    const totalStep = cardWidth + gap;
    if (totalStep > 0) {
      const newIndex = Math.round(scrollLeft / totalStep);
      const clampedIndex = Math.max(0, Math.min(filteredRoutes.length - 1, newIndex));
      setActiveMobileCard((prev) => (prev !== clampedIndex ? clampedIndex : prev));
    }
  };

  const scrollToMobileCard = (idx) => {
    if (gridRef.current && gridRef.current.children[idx]) {
      gridRef.current.children[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
      setActiveMobileCard(idx);
    }
  };

  if (cmsData.showRoutes === false) {
    return null;
  }

  return (
    <section id="rodadas" className="section section-bg-alt">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Próximas Rodadas Oficiales</h2>
          <p className="section-desc">
            Consulta el itinerario, verifica la dificultad y prepárate. Las inscripciones se confirman
            con anticipación para coordinar paradas y seguridad.
          </p>
        </div>

        {/* Filters */}
        <div className="routes-filter reveal">
          {ROUTE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`filter-btn ${filter === cat.key ? 'active' : ''}`}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div 
          ref={gridRef}
          className="routes-grid reveal-group"
          onScroll={isMobile ? handleMobileScroll : undefined}
          style={isMobile ? { justifyContent: 'flex-start' } : undefined}
        >
          {filteredRoutes.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: 'var(--text-muted)' }}>
              No hay rodadas registradas en esta categoría por el momento.
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <div key={route.id} className="stealth-card route-card">
                <div>
                  <div className="route-header">
                    <span className="route-type-badge mono">{route.categoryLabel || route.category}</span>
                    <span className="route-difficulty mono">{route.difficulty}</span>
                  </div>

                  <h3 className="route-title">{route.title}</h3>
                  <p className="route-desc">{route.description}</p>

                  <div className="route-details-list">
                    <div className="route-detail-row">
                      <Calendar />
                      <span>{route.date}</span>
                    </div>
                    <div className="route-detail-row">
                      <Clock />
                      <span>{route.time}</span>
                    </div>
                    <div className="route-detail-row">
                      <MapPin />
                      <span>{route.meetingPoint}</span>
                    </div>
                  </div>
                </div>

                <div className="route-footer">
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>RECORRIDO</span>
                    <span className="route-distance mono">{route.distance}</span>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectRoute(route.title)}
                  >
                    Anotarme
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Pagination Pills */}
        {isMobile && filteredRoutes.length > 1 && (
          <div className="routes-pagination-pills">
            {filteredRoutes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`routes-dot ${activeMobileCard === idx ? 'active' : ''}`}
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Ver rodada ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
