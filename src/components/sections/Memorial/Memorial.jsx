import React, { useState, useEffect, useRef } from 'react';
import './Memorial.css';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

const PROFILES_PER_PAGE = 3;

export default function Memorial({ onNotify }) {
  const { cmsData } = useCms();
  const memorial = cmsData.memorial || [];
  const [litTributes, setLitTributes] = useState({});
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

  // Force scroll to start on the first card whenever mobile loads or memorial updates
  useEffect(() => {
    if (isMobile && gridRef.current) {
      gridRef.current.scrollLeft = 0;
      setActiveMobileCard(0);
    }
  }, [isMobile, memorial.length]);

  const totalPages = Math.max(1, Math.ceil(memorial.length / PROFILES_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages - 1);

  const visibleBrothers = memorial.slice(
    activePage * PROFILES_PER_PAGE,
    activePage * PROFILES_PER_PAGE + PROFILES_PER_PAGE
  );

  const brothersToDisplay = isMobile ? memorial : visibleBrothers;

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
      const clampedIndex = Math.max(0, Math.min(memorial.length - 1, newIndex));
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

  const handleLightCandle = (id, name) => {
    const willBeLit = !litTributes[id];
    setLitTributes((prev) => ({
      ...prev,
      [id]: willBeLit
    }));
    if (onNotify) {
      if (willBeLit) {
        onNotify(`🕯️ Llama encendida en memoria eterna de ${name}`);
      } else {
        onNotify(`Llama apagada`);
      }
    }
  };

  const litCount = Object.values(litTributes).filter(Boolean).length;

  // Synchronize global body illumination state for navbar
  useEffect(() => {
    if (litCount > 0) {
      document.body.classList.add('memorial-candles-lit');
    } else {
      document.body.classList.remove('memorial-candles-lit');
    }
    return () => {
      document.body.classList.remove('memorial-candles-lit');
    };
  }, [litCount]);

  return (
    <section id="memorial" className={`section memorial-section ${litCount > 0 ? 'memorial-section-lit' : ''}`}>
      <div className="container">
        <div className={`section-header reveal memorial-header ${litCount > 0 ? 'memorial-header-lit' : ''}`}>
          <div className={`memorial-halo-badge ${litCount > 0 ? 'active' : ''}`}>
            <Flame size={14} className={litCount > 0 ? 'flame-flicker' : ''} />
            <span>
              {litCount === 0 
                ? 'Homenaje a los Hermanos Caídos' 
                : litCount === 1 
                  ? '1 Llama Encendida en su Memoria' 
                  : `${litCount} Llamas Encendidas en su Memoria`}
            </span>
          </div>

          <h2 className="section-title memorial-title">Rodando en la Ruta Eterna</h2>
          <p className="section-desc memorial-desc">
            A nuestros hermanos que se nos adelantaron en el camino. Ninguna rodada comienza
            sin recordar su huella, su risa y su estruendo en la carretera.
          </p>

          <div className="memorial-header-glow-line" aria-hidden="true"></div>
        </div>

        {/* Carousel Container */}
        <div className="memorial-carousel-container reveal">
          <div 
            ref={gridRef}
            className="memorial-grid reveal-group" 
            key={isMobile ? 'mobile-carousel' : activePage}
            onScroll={isMobile ? handleMobileScroll : undefined}
            style={
              isMobile
                ? { justifyContent: 'flex-start' }
                : {
                    gridTemplateColumns: visibleBrothers.length === 1 
                      ? 'minmax(0, 380px)' 
                      : visibleBrothers.length === 2 
                        ? 'repeat(2, minmax(0, 380px))' 
                        : 'repeat(3, minmax(0, 1fr))',
                    justifyContent: 'center'
                  }
            }
          >
            {brothersToDisplay.map((brother) => {
              const isLit = Boolean(litTributes[brother.id]);
              return (
                <div key={brother.id} className={`memorial-card ${isLit ? 'memorial-card-lit' : ''}`}>
                  {/* Floating candle sparks when lit */}
                  {isLit && (
                    <div className="card-sparks-container" aria-hidden="true">
                      <span className="candle-spark spark-1"></span>
                      <span className="candle-spark spark-2"></span>
                      <span className="candle-spark spark-3"></span>
                      <span className="candle-spark spark-4"></span>
                    </div>
                  )}

                  {/* Flame Badge */}
                  {isLit && (
                    <div className="candle-flame-wrapper">
                      <Flame size={13} className="flame-flicker" />
                      <span>Llama Eterna</span>
                    </div>
                  )}

                  <div className="memorial-portrait-container">
                    <img 
                      src={brother.image || '/logo.jpg'} 
                      alt={brother.name} 
                      className="memorial-portrait" 
                      loading="lazy"
                      decoding="async"
                    />
                    {isLit && <div className="portrait-candle-glow" aria-hidden="true"></div>}
                  </div>

                  <span className="memorial-years mono">{brother.years}</span>
                  <h3 className="memorial-name">{brother.name}</h3>
                  <span className="memorial-moto mono">🏍️ {brother.moto}</span>

                  <p className="memorial-words">
                    {brother.words}
                  </p>

                  <button 
                    type="button"
                    className={`memorial-tribute-btn ${isLit ? 'lit' : ''}`}
                    onClick={() => handleLightCandle(brother.id, brother.name)}
                    aria-label={isLit ? `Apagar llama de ${brother.name}` : `Encender llama en memoria de ${brother.name}`}
                  >
                    <Flame size={16} className={isLit ? 'flame-flicker' : ''} />
                    <span>{isLit ? 'Llama Encendida en su Honor' : 'Encender Llama en su Memoria'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Controles de Navegación del Carrusel */}
          {isMobile ? (
            memorial.length > 1 && (
              <div className="memorial-pagination-pills" style={{ marginTop: '1.25rem', justifyContent: 'center' }}>
                {memorial.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`memorial-dot ${activeMobileCard === idx ? 'active' : ''}`}
                    onClick={() => scrollToMobileCard(idx)}
                    aria-label={`Ver homenaje ${idx + 1}`}
                  />
                ))}
              </div>
            )
          ) : (
            totalPages > 1 && (
              <div className="memorial-carousel-controls">
                <button 
                  type="button" 
                  className="memorial-nav-btn"
                  onClick={handlePrevPage}
                  aria-label="Homenajes anteriores"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="memorial-pagination-pills">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`memorial-dot ${activePage === idx ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx)}
                      aria-label={`Ir a la página ${idx + 1}`}
                    />
                  ))}
                </div>

                <button 
                  type="button" 
                  className="memorial-nav-btn"
                  onClick={handleNextPage}
                  aria-label="Siguientes homenajes"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
