import React from 'react';
import { Save } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function FaqsTab({ onNotify }) {
  const { cmsData, updateFaq } = useCms();

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Preguntas Frecuentes</h3>
          <p className="admin-panel-desc">Resuelve dudas sobre rodadas, parches y cuotas.</p>
        </div>
      </div>

      {cmsData.faqs?.map((faq, idx) => (
        <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
          <div className="form-group-full" style={{ marginBottom: '0.6rem' }}>
            <label className="form-label">Pregunta</label>
            <input 
              type="text" 
              className="form-input" 
              value={faq.question || ''}
              onChange={(e) => updateFaq(idx, { question: e.target.value })}
            />
          </div>
          <div className="form-group-full">
            <label className="form-label">Respuesta</label>
            <textarea 
              className="form-textarea" 
              value={faq.answer || ''}
              onChange={(e) => updateFaq(idx, { answer: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button 
        type="button" 
        className="btn btn-primary" 
        style={{ marginTop: '0.8rem' }}
        onClick={() => {
          if (onNotify) onNotify('Preguntas guardadas con éxito');
        }}
      >
        <Save size={18} /> Guardar Preguntas
      </button>
    </div>
  );
}
