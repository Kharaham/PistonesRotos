import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function GaleriaTab({ onNotify, onImageUpload, setConfirmDialog }) {
  const { 
    cmsData, 
    addGalleryPhoto, 
    updateGalleryPhoto, 
    deleteGalleryPhoto 
  } = useCms();

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    tag: 'Carretera',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
  });

  const handleCreatePhoto = (e) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.image) return;
    addGalleryPhoto(newPhoto);
    setNewPhoto({ title: '', tag: 'Carretera', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80' });
    setIsAddingPhoto(false);
    if (onNotify) onNotify('Foto agregada a la galería');
  };

  const handleUpdatePhoto = (e) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.image) return;
    updateGalleryPhoto(editingPhoto.id, editingPhoto);
    setEditingPhoto(null);
    if (onNotify) onNotify('Foto actualizada con éxito');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Galería de Fotos</h3>
          <p className="admin-panel-desc">Sube y organiza las fotografías de rodadas y camaradería.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => {
            setIsAddingPhoto(!isAddingPhoto);
            if (!isAddingPhoto) setEditingPhoto(null);
          }}
        >
          <Plus size={16} /> {isAddingPhoto ? 'Cerrar' : 'Nueva Foto'}
        </button>
      </div>

      {isAddingPhoto && (
        <form onSubmit={handleCreatePhoto} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Agregar Foto a la Galería</h4>
          <div className="form-grid">
            <div>
              <label className="form-label">Título de la Foto</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ej: Paso Los Libertadores al Atardecer"
                value={newPhoto.title}
                onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Etiqueta</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Carretera, Taller, Hermandad"
                value={newPhoto.tag}
                onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Imagen</label>
              <div className="image-preview-group">
                <img src={newPhoto.image} alt="Preview" className="image-preview-thumb" />
                <div className="image-preview-controls">
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newPhoto.image}
                    onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    <Upload size={14} /> Subir Archivo
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => onImageUpload(e, (url) => setNewPhoto({ ...newPhoto, image: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
            <Plus size={16} /> Publicar en Galería
          </button>
        </form>
      )}

      {/* Edit Photo Form */}
      {editingPhoto && (
        <form onSubmit={handleUpdatePhoto} style={{ marginBottom: '2rem', background: '#121318', padding: '1.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h4 style={{ margin: 0, color: '#ffffff' }}>Editar Fotografía</h4>
              <span className="mono" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#ffffff', color: '#000', fontWeight: 700 }}>
                EDITANDO
              </span>
            </div>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={() => setEditingPhoto(null)}
              title="Cancelar edición"
            >
              <X size={16} />
            </button>
          </div>

          <div className="form-grid">
            <div>
              <label className="form-label">Título de la Foto</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={editingPhoto.title || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Etiqueta</label>
              <input 
                type="text" 
                className="form-input" 
                value={editingPhoto.tag || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, tag: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Imagen</label>
              <div className="image-preview-group">
                <img src={editingPhoto.image} alt={editingPhoto.title} className="image-preview-thumb" />
                <div className="image-preview-controls">
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingPhoto.image || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    <Upload size={14} /> Subir Archivo
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => onImageUpload(e, (url) => setEditingPhoto({ ...editingPhoto, image: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={15} /> Guardar Cambios
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setEditingPhoto(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
        {cmsData.gallery?.map((photo) => {
          const isEditing = editingPhoto?.id === photo.id;
          return (
            <div 
              key={photo.id} 
              style={{ 
                position: 'relative', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                border: isEditing ? '2px solid #ffffff' : '1px solid var(--border-subtle)', 
                background: '#111',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isEditing ? 'scale(1.02)' : 'none',
                boxShadow: isEditing ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
              }}
              onClick={() => {
                if (isEditing) {
                  setEditingPhoto(null);
                } else {
                  setEditingPhoto({ ...photo });
                  setIsAddingPhoto(false);
                }
              }}
              title="Haz clic para editar la foto"
            >
              <img src={photo.image} alt={photo.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: '#0d0e12' }}>
                <div style={{ overflow: 'hidden', minWidth: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {photo.title}
                  </span>
                  <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    [{photo.tag}]
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    type="button"
                    className="btn-icon"
                    style={{ padding: '0.35rem', color: isEditing ? '#ffffff' : 'var(--text-secondary)' }}
                    title={isEditing ? 'Cerrar edición' : 'Editar foto'}
                    onClick={() => {
                      if (isEditing) {
                        setEditingPhoto(null);
                      } else {
                        setEditingPhoto({ ...photo });
                        setIsAddingPhoto(false);
                      }
                    }}
                  >
                    {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon btn-danger"
                    style={{ padding: '0.35rem' }}
                    title="Eliminar foto"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: '¿Eliminar Fotografía?',
                        message: `¿Deseas eliminar la foto "${photo.title}" de la galería oficial?`,
                        confirmText: 'Sí, Eliminar',
                        cancelText: 'Cancelar',
                        variant: 'danger',
                        action: () => {
                          deleteGalleryPhoto(photo.id);
                          if (editingPhoto?.id === photo.id) setEditingPhoto(null);
                          if (onNotify) onNotify('Foto eliminada de la galería');
                        }
                      });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
