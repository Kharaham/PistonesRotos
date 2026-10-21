import React from 'react';
import './Rules.css';
import { useCms } from '../../../context/CmsContext';

export default function Rules() {
  const { cmsData } = useCms();
  const rules = cmsData.rules || [];

  return (
    <section id="reglas" className="section">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Código de Honor en Ruta</h2>
          <p className="section-desc">
            Para garantizar que cada salida sea una experiencia impecable, exigimos el cumplimiento
            innegociable de estas condiciones a todo participante.
          </p>
        </div>

        <div className="rules-grid reveal-group">
          {rules.map((rule, idx) => (
            <div key={idx} className="rule-box">
              <div className="rule-num">{rule.num}</div>
              <h3 className="rule-title">{rule.title}</h3>
              <p className="rule-desc">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
