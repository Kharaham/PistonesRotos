import React from 'react';
import './Toast.css';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast" role="alert">
      <CheckCircle2 size={18} color="#08080a" />
      <span>{message}</span>
    </div>
  );
}
