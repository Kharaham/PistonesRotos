import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function HeroTab({ onNotify, onImageUpload }) {
  const { cmsData, updateHero } = useCms();
  const [heroForm, setHeroForm] = useState({ ...cmsData.hero });

  useEffect(() => {
    setHeroForm({ ...cmsData.hero });
  }, [cmsData.hero]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHero(heroForm);
    if (onNotify) onNotify('Portada principal guardada');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Portada & Contadores</h3>
          <p className="admin-panel-desc">Personaliza el mensaje inicial y estadísticas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group-full">
            <label className="form-label">Badge Superior</label>
            <input 
              type="text" 
              className="form-input" 
              value={heroForm.badge || ''}
              onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Título Principal</label>
            <textarea 
              className="form-textarea" 
              style={{ minHeight: '80px' }}
              value={heroForm.title || ''}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Descripción</label>
            <textarea 
              className="form-textarea" 
              value={heroForm.description || ''}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Foto de Fondo (Hero Banner)</label>
            <div className="image-preview-group">
              <img src={heroForm.bgImage || '/hero.jpg'} alt="Fondo" className="image-preview-thumb" />
              <div className="image-preview-controls">
                <input 
                  type="text" 
                  className="form-input" 
                  value={heroForm.bgImage || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, bgImage: e.target.value })}
                />
                <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={14} /> Subir Nueva Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => onImageUpload(e, (url) => setHeroForm({ ...heroForm, bgImage: url }))}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          <Save size={18} /> Guardar Portada
        </button>
      </form>
    </div>
  );
}
