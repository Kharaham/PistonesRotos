import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function IdentidadTab({ onNotify, onImageUpload }) {
  const { cmsData, updateClubInfo } = useCms();
  const [clubForm, setClubForm] = useState({ ...cmsData.clubInfo });

  useEffect(() => {
    setClubForm({ ...cmsData.clubInfo });
  }, [cmsData.clubInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClubInfo(clubForm);
    if (onNotify) onNotify('Identidad del club guardada');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Identidad del Club</h3>
          <p className="admin-panel-desc">Ajusta el nombre, logo y redes oficiales.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="form-label">Nombre del Club</label>
            <input 
              type="text" 
              className="form-input" 
              value={clubForm.name || ''}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Lema o Subtítulo</label>
            <input 
              type="text" 
              className="form-input" 
              value={clubForm.tagline || ''}
              onChange={(e) => setClubForm({ ...clubForm, tagline: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Año de Fundación</label>
            <input 
              type="text" 
              className="form-input" 
              value={clubForm.founded || ''}
              onChange={(e) => setClubForm({ ...clubForm, founded: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Instagram</label>
            <input 
              type="text" 
              className="form-input" 
              value={clubForm.instagramHandle || ''}
              onChange={(e) => setClubForm({ ...clubForm, instagramHandle: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Enlace WhatsApp Oficial</label>
            <input 
              type="text" 
              className="form-input" 
              value={clubForm.whatsappLink || ''}
              onChange={(e) => setClubForm({ ...clubForm, whatsappLink: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Logo / Emblema</label>
            <div className="image-preview-group">
              <img src={clubForm.logoImage || '/logo.jpg'} alt="Logo" className="image-preview-thumb" />
              <div className="image-preview-controls">
                <input 
                  type="text" 
                  className="form-input" 
                  value={clubForm.logoImage || ''}
                  onChange={(e) => setClubForm({ ...clubForm, logoImage: e.target.value })}
                />
                <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={14} /> Subir Imagen
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => onImageUpload(e, (url) => setClubForm({ ...clubForm, logoImage: url }))}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          <Save size={18} /> Guardar Identidad
        </button>
      </form>
    </div>
  );
}
