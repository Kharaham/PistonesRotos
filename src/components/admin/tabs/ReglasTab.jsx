import React from 'react';
import { Save } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function ReglasTab({ onNotify }) {
  const { cmsData, updateRule } = useCms();

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Código de Honor</h3>
          <p className="admin-panel-desc">Mandamientos de seguridad del club.</p>
        </div>
      </div>

      {cmsData.rules?.map((rule, idx) => (
        <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
          <div className="form-grid">
            <div>
              <label className="form-label">Título</label>
              <input 
                type="text" 
                className="form-input" 
                value={rule.title || ''}
                onChange={(e) => updateRule(idx, { title: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Descripción</label>
              <textarea 
                className="form-textarea" 
                style={{ minHeight: '70px' }}
                value={rule.desc || ''}
                onChange={(e) => updateRule(idx, { desc: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        type="button" 
        className="btn btn-primary" 
        style={{ marginTop: '0.8rem' }}
        onClick={() => {
          if (onNotify) onNotify('Reglas guardadas con éxito');
        }}
      >
        <Save size={18} /> Guardar Reglas
      </button>
    </div>
  );
}
