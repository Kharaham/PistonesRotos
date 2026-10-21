import React, { useState } from 'react';
import './Faq.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Faq() {
  const { cmsData } = useCms();
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = cmsData.faqs || [];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? -1 : index);
  };

  return (
    <section id="faq" className="section section-bg-alt">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-desc">
            Respuestas rápidas para quienes desean dar su primera rodada con Los Pistones Rotos.
          </p>
        </div>

        <div className="faq-list reveal-group">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="faq-item">
                <button 
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
