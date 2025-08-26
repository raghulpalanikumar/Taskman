import { useState } from 'react';
import './AIAssistant.css';

export default function AIAssistant({ open, onClose }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAnswer(data.error ? `Error: ${data.error}` : `Error: HTTP ${res.status}`);
      } else {
        setAnswer(data.answer || 'No answer received.');
      }
    } catch (err) {
      setAnswer('Error contacting AI service.');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="ai-assistant-modal-overlay">
      <div className="ai-assistant-modal">
        <button className="ai-assistant-close" onClick={onClose}>&times;</button>
        <h2>AI Task Assistant</h2>
        <form onSubmit={handleAsk} className="ai-assistant-form">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask about task management..."
            className="ai-assistant-input"
            disabled={loading}
          />
          <button type="submit" className="ai-assistant-submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        {answer && <div className="ai-assistant-answer">{answer}</div>}
      </div>
    </div>
  );
}
