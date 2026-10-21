import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function DatabaseTab({ onNotify, setConfirmDialog }) {
  const { resetToDefaults } = useCms();

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Base de Datos & Supabase</h3>
          <p className="admin-panel-desc">Conexión en la nube para sincronizar todos los cambios.</p>
        </div>
      </div>

      <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Check size={18} /> Modo Local Persistente Activo
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Todo lo que edites (Historia, Directiva, Memorial, Rutas, Fotos) se guarda inmediatamente en el almacenamiento local del navegador.
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
        <h4 style={{ color: '#ffffff', marginBottom: '0.6rem' }}>Restaurar Contenido Original de Fábrica</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Restablece todos los textos, imágenes, directiva, rodadas y memorial a sus valores iniciales.
        </p>
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          style={{ color: '#f87171' }}
          onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: '¿Restaurar Contenido de Fábrica?',
              message: 'Esta acción restablecerá todos los textos, imágenes, miembros y rodadas a sus valores por defecto. Se perderán las modificaciones personalizadas.',
              confirmText: 'Restaurar Todo',
              cancelText: 'Cancelar',
              variant: 'warning',
              action: () => {
                resetToDefaults();
                if (onNotify) onNotify('Contenido restaurado a valores por defecto');
              }
            });
          }}
        >
          <RotateCcw size={16} /> Restaurar Fábrica
        </button>
      </div>
    </div>
  );
}
