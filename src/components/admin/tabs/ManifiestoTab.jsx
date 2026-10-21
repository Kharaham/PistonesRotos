import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function ManifiestoTab({ onNotify }) {
  const { cmsData, updateManifest } = useCms();
  const [manifestForm, setManifestForm] = useState({ ...cmsData.manifest });

  useEffect(() => {
    setManifestForm({ ...cmsData.manifest });
  }, [cmsData.manifest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateManifest(manifestForm);
    if (onNotify) onNotify('Manifiesto y pilares guardados');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Manifiesto & 4 Pilares</h3>
          <p className="admin-panel-desc">Edita los pilares y mandamientos de la hermandad.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group-full">
            <label className="form-label">Título</label>
            <input 
              type="text" 
              className="form-input" 
              value={manifestForm.title || ''}
              onChange={(e) => setManifestForm({ ...manifestForm, title: e.target.value })}
            />
          </div>

          {manifestForm.pillars?.map((pillar, idx) => (
            <div key={idx} className="form-group-full" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Clave</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={pillar.number || ''}
                    onChange={(e) => {
                      const updated = [...manifestForm.pillars];
                      updated[idx] = { ...updated[idx], number: e.target.value };
                      setManifestForm({ ...manifestForm, pillars: updated });
                    }}
                  />
                </div>
                <div>
                  <label className="form-label">Título del Pilar</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={pillar.title || ''}
                    onChange={(e) => {
                      const updated = [...manifestForm.pillars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setManifestForm({ ...manifestForm, pillars: updated });
                    }}
                  />
                </div>
                <div className="form-group-full">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-textarea" 
                    style={{ minHeight: '75px' }}
                    value={pillar.text || ''}
                    onChange={(e) => {
                      const updated = [...manifestForm.pillars];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setManifestForm({ ...manifestForm, pillars: updated });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <Save size={18} /> Guardar Manifiesto
        </button>
      </form>
    </div>
  );
}
