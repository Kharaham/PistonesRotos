import React, { useState, useEffect, useRef } from 'react';
import './Gallery.css';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

const PHOTOS_PER_PAGE = 6;

export default function Gallery() {
  const { cmsData } = useCms();
  const gallery = cmsData.gallery || [];
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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

  // Force scroll to start on the first photo whenever mobile loads or gallery updates
  useEffect(() => {
    if (isMobile && gridRef.current) {
      gridRef.current.scrollLeft = 0;
      setActiveMobileCard(0);
    }
  }, [isMobile, gallery.length]);

  const totalPages = Math.max(1, Math.ceil(gallery.length / PHOTOS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages - 1);
  const visiblePhotos = gallery.slice(activePage * PHOTOS_PER_PAGE, activePage * PHOTOS_PER_PAGE + PHOTOS_PER_PAGE);

  const photosToDisplay = isMobile ? gallery : visiblePhotos;

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
      const clampedIndex = Math.max(0, Math.min(gallery.length - 1, newIndex));
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

  // Lightbox navigation
  const currentLightboxIndex = selectedPhoto ? gallery.findIndex((p) => p.id === selectedPhoto.id) : -1;

  const handlePrevLightbox = (e) => {
    e.stopPropagation();
    if (currentLightboxIndex > 0) {
      setSelectedPhoto(gallery[currentLightboxIndex - 1]);
    } else {
      setSelectedPhoto(gallery[gallery.length - 1]);
    }
  };

  const handleNextLightbox = (e) => {
    e.stopPropagation();
    if (currentLightboxIndex < gallery.length - 1) {
      setSelectedPhoto(gallery[currentLightboxIndex + 1]);
    } else {
      setSelectedPhoto(gallery[0]);
    }
  };

  return (
    <section id="galeria" className="section">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">La Manada en Imágenes</h2>
          <p className="section-desc">
            Momentos capturados en ruta, paradas en el camino y la hermandad que se vive
            cuando se apagan los motores.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="gallery-carousel-container reveal">
          <div 
            ref={gridRef}
            className="gallery-grid reveal-group" 
            key={isMobile ? 'mobile-gallery' : activePage}
            onScroll={isMobile ? handleMobileScroll : undefined}
            style={isMobile ? { justifyContent: 'flex-start' } : undefined}
          >
            {photosToDisplay.map((photo) => (
              <div 
                key={photo.id} 
                className="gallery-card"
                onClick={() => setSelectedPhoto(photo)}
                title="Ver imagen completa"
              >
                <img src={photo.image} alt={photo.title} className="gallery-img" loading="lazy" decoding="async" />
                <div className="gallery-card-overlay">
                  <span className="gallery-tag mono">{photo.tag}</span>
                  <h3 className="gallery-item-title">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Controls on Desktop (when more than 6 photos) */}
          {!isMobile && totalPages > 1 && (
            <div className="gallery-carousel-controls">
              <button 
                type="button" 
                className="gallery-nav-btn"
                onClick={handlePrevPage}
                aria-label="Página anterior de fotos"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="gallery-pagination-pills">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-dot ${activePage === idx ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx)}
                    aria-label={`Ir al grupo ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                type="button" 
                className="gallery-nav-btn"
                onClick={handleNextPage}
                aria-label="Página siguiente de fotos"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}

          {/* Mobile Pagination Pills */}
          {isMobile && gallery.length > 1 && (
            <div className="gallery-pagination-pills" style={{ marginTop: '1.25rem', justifyContent: 'center' }}>
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-dot ${activeMobileCard === idx ? 'active' : ''}`}
                  onClick={() => scrollToMobileCard(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Next / Prev support */}
      {selectedPhoto && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close-btn"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Cerrar vista completa"
            >
              <X size={26} />
            </button>

            {gallery.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="lightbox-arrow lightbox-arrow-left"
                  onClick={handlePrevLightbox}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={30} />
                </button>
                <button 
                  type="button" 
                  className="lightbox-arrow lightbox-arrow-right"
                  onClick={handleNextLightbox}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}

            <img 
              src={selectedPhoto.image} 
              alt={selectedPhoto.title} 
              className="lightbox-image" 
            />
            <div className="lightbox-caption">
              <span>{selectedPhoto.title}</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                [{selectedPhoto.tag}]
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
