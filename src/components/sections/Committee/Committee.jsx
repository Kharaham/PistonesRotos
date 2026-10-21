import React, { useState, useEffect, useRef } from 'react';
import './Committee.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

const MEMBERS_PER_PAGE = 4;

export default function Committee() {
  const { cmsData } = useCms();
  const committee = cmsData.committee || [];
  const [currentPage, setCurrentPage] = useState(0);
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

  // Force scroll to start on the first card whenever mobile loads or committee updates
  useEffect(() => {
    if (isMobile && gridRef.current) {
      gridRef.current.scrollLeft = 0;
      setActiveMobileCard(0);
    }
  }, [isMobile, committee.length]);

  const totalPages = Math.max(1, Math.ceil(committee.length / MEMBERS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages - 1);

  const visibleMembers = committee.slice(
    activePage * MEMBERS_PER_PAGE,
    activePage * MEMBERS_PER_PAGE + MEMBERS_PER_PAGE
  );

  const membersToDisplay = isMobile ? committee : visibleMembers;

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleMobileScroll = (e) => {
    const el = e.target;
    if (!el || !el.firstElementChild) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild.offsetWidth;
    const gap = 20; // 1.25rem = 20px
    const totalStep = cardWidth + gap;
    if (totalStep > 0) {
      const newIndex = Math.round(scrollLeft / totalStep);
      const clampedIndex = Math.max(0, Math.min(committee.length - 1, newIndex));
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

  return (
    <section id="directiva" className="section section-bg-alt committee-section">
      <div className="container committee-container">
        <div className="section-header reveal">
          <h2 className="section-title">Comité & Mesa Directiva</h2>
          <p className="section-desc">
            Los encargados de mantener la hermandad unida, coordinar cada salida oficial
            y velar por la seguridad de todos los pilotos.
          </p>
        </div>

        <div className="committee-carousel-container reveal">
          <div className="committee-carousel-wrapper">
            {!isMobile && totalPages > 1 && (
              <button 
                type="button" 
                className="committee-arrow committee-arrow-left"
                onClick={handlePrevPage}
                aria-label="Miembros anteriores"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div 
              ref={gridRef}
              className="committee-grid reveal-group"
              key={isMobile ? 'mobile-carousel' : activePage}
              onScroll={isMobile ? handleMobileScroll : undefined}
              style={
                isMobile
                  ? { justifyContent: 'flex-start' }
                  : {
                      gridTemplateColumns: visibleMembers.length === 1
                        ? 'minmax(0, 320px)'
                        : visibleMembers.length === 2
                          ? 'repeat(2, minmax(0, 340px))'
                          : visibleMembers.length === 3
                            ? 'repeat(3, minmax(0, 1fr))'
                            : 'repeat(4, minmax(0, 1fr))',
                      justifyContent: 'center'
                    }
              }
            >
              {membersToDisplay.map((member) => (
                <div key={member.id} className="stealth-card committee-card">
                  <div className="committee-avatar-wrapper">
                    <img 
                      src={member.image || '/logo.jpg'} 
                      alt={member.name} 
                      className="committee-avatar" 
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="committee-role-wrapper">
                    <span className="committee-role-badge mono">{member.role}</span>
                  </div>

                  <h3 className="committee-name">{member.name}</h3>

                  <div className="committee-meta mono">
                    <span>🏍️ {member.moto}</span>
                    <span>⏱️ {member.years}</span>
                  </div>

                  <p className="committee-bio">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>

            {!isMobile && totalPages > 1 && (
              <button 
                type="button" 
                className="committee-arrow committee-arrow-right"
                onClick={handleNextPage}
                aria-label="Siguientes miembros"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {isMobile ? (
            committee.length > 1 && (
              <div className="committee-pagination-pills">
                {committee.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`committee-dot ${activeMobileCard === idx ? 'active' : ''}`}
                    onClick={() => scrollToMobileCard(idx)}
                    aria-label={`Ver miembro ${idx + 1}`}
                  />
                ))}
              </div>
            )
          ) : (
            totalPages > 1 && (
              <div className="committee-pagination-pills">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`committee-dot ${activePage === idx ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx)}
                    aria-label={`Ir a la página ${idx + 1}`}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
