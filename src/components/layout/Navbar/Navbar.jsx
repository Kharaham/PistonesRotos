import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Navbar() {
  const { cmsData } = useCms();
  const { clubInfo } = cmsData;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand: Left-aligned and fully visible */}
        <a href="#inicio" className="brand" onClick={closeMenu}>
          <img 
            src={clubInfo.logoImage || '/logo.jpg'} 
            alt={`Logo ${clubInfo.name}`} 
            className="brand-logo-img" 
          />
          <div className="brand-text">
            <span className="brand-title">{clubInfo.name}</span>
            <span className="brand-subtitle mono">{clubInfo.tagline}</span>
          </div>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <ul className="nav-links">
          <li>
            <a href="#inicio" className="nav-link">Inicio</a>
          </li>
          <li>
            <a href="#historia" className="nav-link">Historia</a>
          </li>
          <li>
            <a href="#manifiesto" className="nav-link">Manifiesto</a>
          </li>
          <li>
            <a href="#directiva" className="nav-link">Directiva</a>
          </li>
          <li>
            <a href="#galeria" className="nav-link">Galería</a>
          </li>
          {cmsData.showRoutes !== false && (
            <li>
              <a href="#rodadas" className="nav-link">Rodadas</a>
            </li>
          )}
          <li>
            <a href="#memorial" className="nav-link">Memorial</a>
          </li>
        </ul>

        {/* Right: Actions (Subtle Status Badge & Burger on mobile) */}
        <div className="navbar-actions">
          <div className="nav-club-badge mono">
            <span className="nav-status-dot"></span>
            <span>CHILE // {clubInfo.founded || '2021'}</span>
          </div>

          <button 
            type="button"
            className="menu-toggle"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}>
        <ul className="mobile-nav-list">
          <li>
            <a href="#inicio" className="mobile-nav-link" onClick={closeMenu}>
              <span>Inicio</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#historia" className="mobile-nav-link" onClick={closeMenu}>
              <span>Historia</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#manifiesto" className="mobile-nav-link" onClick={closeMenu}>
              <span>Manifiesto</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#directiva" className="mobile-nav-link" onClick={closeMenu}>
              <span>Directiva</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#galeria" className="mobile-nav-link" onClick={closeMenu}>
              <span>Galería</span>
              <ChevronRight size={16} />
            </a>
          </li>
          {cmsData.showRoutes !== false && (
            <li>
              <a href="#rodadas" className="mobile-nav-link" onClick={closeMenu}>
                <span>Rodadas</span>
                <ChevronRight size={16} />
              </a>
            </li>
          )}
          <li>
            <a href="#reglas" className="mobile-nav-link" onClick={closeMenu}>
              <span>Código</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#memorial" className="mobile-nav-link" onClick={closeMenu}>
              <span>Memorial</span>
              <ChevronRight size={16} />
            </a>
          </li>
          <li>
            <a href="#faq" className="mobile-nav-link" onClick={closeMenu}>
              <span>Preguntas</span>
              <ChevronRight size={16} />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
