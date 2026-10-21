import React, { useEffect } from 'react';
import './ConfirmModal.css';
import { Trash2, RotateCcw, X, AlertOctagon } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = '¿Confirmar Acción?',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning'
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="confirm-modal-overlay" 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="confirm-modal-card">
        <button 
          type="button" 
          className="confirm-modal-close"
          onClick={onCancel}
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        <div className="confirm-modal-tag mono">
          <AlertOctagon size={12} />
          <span>{variant === 'warning' ? 'SISTEMA // REINICIO' : 'SISTEMA // ACCIÓN PERMANENTE'}</span>
        </div>

        <div className={`confirm-modal-icon-wrapper ${variant}`}>
          {variant === 'warning' ? (
            <RotateCcw size={28} />
          ) : (
            <Trash2 size={28} />
          )}
        </div>

        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary confirm-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          
          <button 
            type="button" 
            className={`btn ${variant === 'warning' ? 'btn-warning-confirm' : 'btn-danger-confirm'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

