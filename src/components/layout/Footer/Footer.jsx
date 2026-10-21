import React from 'react';
import './Footer.css';
import { Lock } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Footer({ onOpenAdmin }) {
  const { cmsData } = useCms();
  const { clubInfo } = cmsData;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="brand" style={{ marginBottom: '1rem' }}>
              <img 
                src={clubInfo.logoImage || '/logo.jpg'} 
                alt="Logo" 
                className="brand-logo-img" 
              />
              <div className="brand-text">
                <span className="brand-title">{clubInfo.name}</span>
                <span className="brand-subtitle mono">{clubInfo.tagline}</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Comunidad sin fines de lucro enfocada en la fraternidad en dos ruedas, 
              la conducción preventiva y la exploración de las mejores rutas del país.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Secciones</h4>
            <ul className="footer-links">
              <li><a href="#inicio" className="footer-link">Inicio</a></li>
              <li><a href="#manifiesto" className="footer-link">Manifiesto</a></li>
              {cmsData.showRoutes !== false && (
                <li><a href="#rodadas" className="footer-link">Calendario Rutas</a></li>
              )}
              <li><a href="#reglas" className="footer-link">Código de Seguridad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Comunidad</h4>
            <ul className="footer-links">
              <li><a href="#faq" className="footer-link">Preguntas Frecuentes</a></li>
              <li><a href="#contacto" className="footer-link">Postulación Miembros</a></li>
              <li><a href={clubInfo.whatsappLink || 'https://wa.me/56900000000'} target="_blank" rel="noopener noreferrer" className="footer-link">Grupo WhatsApp</a></li>
              <li><a href={clubInfo.instagramLink || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Contacto Rápido</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
              ¿Tienes dudas sobre las rodadas o quieres invitarnos a un evento?
            </p>
            <a href="#contacto" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              Escribir al Directorio
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 {clubInfo.name}. Dos ruedas, un solo asfalto.</span>
          <div>
            <button 
              type="button" 
              onClick={onOpenAdmin}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
            >
              <Lock size={12} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
