import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function CaravanaTab({ onNotify, onImageUpload }) {
  const { cmsData, updateConvoy } = useCms();
  const [convoyForm, setConvoyForm] = useState({ ...cmsData.convoy });

  useEffect(() => {
    setConvoyForm({ ...cmsData.convoy });
  }, [cmsData.convoy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateConvoy(convoyForm);
    if (onNotify) onNotify('Sección caravana guardada');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Caravana & Manada</h3>
          <p className="admin-panel-desc">Foto y cita destacada de disciplina en ruta.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group-full">
            <label className="form-label">Título</label>
            <input 
              type="text" 
              className="form-input" 
              value={convoyForm.title || ''}
              onChange={(e) => setConvoyForm({ ...convoyForm, title: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Cita Destacada</label>
            <textarea 
              className="form-textarea" 
              value={convoyForm.quote || ''}
              onChange={(e) => setConvoyForm({ ...convoyForm, quote: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Foto de Caravana</label>
            <div className="image-preview-group">
              <img src={convoyForm.image || '/convoy.jpg'} alt="Convoy" className="image-preview-thumb" />
              <div className="image-preview-controls">
                <input 
                  type="text" 
                  className="form-input" 
                  value={convoyForm.image || ''}
                  onChange={(e) => setConvoyForm({ ...convoyForm, image: e.target.value })}
                />
                <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={14} /> Subir Imagen
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => onImageUpload(e, (url) => setConvoyForm({ ...convoyForm, image: url }))}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <Save size={18} /> Guardar Caravana
        </button>
      </form>
    </div>
  );
}
