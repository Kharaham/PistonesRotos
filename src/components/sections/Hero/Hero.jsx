import React from 'react';
import './Hero.css';
import { Compass } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Hero() {
  const { cmsData } = useCms();
  const { hero, clubInfo } = cmsData;

  return (
    <header id="inicio" className="hero-section">
      <div className="hero-bg">
        <img 
          src={hero.bgImage || '/hero.jpg'} 
          alt="Moto en la noche" 
          className="hero-bg-img" 
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-content animate-fade">
        <div className="badge">
          <span className="badge-dot"></span>
          {hero.badge || `HERMANDAD DEL ASFALTO • EST. ${clubInfo.founded}`}
        </div>

        <h1 className="hero-title">
          {hero.title}
        </h1>

        <p className="hero-description">
          {hero.description}
        </p>

        <div className="hero-actions">
          <a href="#rodadas" className="btn btn-primary">
            <Compass size={18} />
            Ver Próximas Rodadas
          </a>
          <a href="#manifiesto" className="btn btn-secondary">
            Leer Manifiesto
          </a>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="stats-grid">
          {hero.stats && hero.stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-value mono">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
