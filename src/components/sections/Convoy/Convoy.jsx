import React from 'react';
import './Convoy.css';
import { CheckCircle2 } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Convoy() {
  const { cmsData } = useCms();
  const { convoy } = cmsData;

  return (
    <section className="section">
      <div className="container">
        <div className="convoy-feature">
          <div className="convoy-img-container reveal-left">
            <img 
              src={convoy.image || '/convoy.jpg'} 
              alt="Caravana de motos en la noche" 
              className="convoy-img" 
              loading="lazy"
              decoding="async"
            />
            <div className="badge convoy-tag">{convoy.tag || 'EN FORMACIÓN NOCTURNA'}</div>
          </div>

          <div className="convoy-info reveal-right">
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: 0 }}>
              {convoy.title}
            </h2>
            <p className="convoy-quote">
              {convoy.quote}
            </p>
            
            <ul className="convoy-list reveal-group">
              {convoy.items && convoy.items.map((item, idx) => (
                <li key={idx} className="convoy-item">
                  <CheckCircle2 size={20} className="convoy-item-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="convoy-cta-wrapper">
              <a href="#contacto" className="btn btn-primary">
                Sumarme al Grupo Oficial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
