import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, Send, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { apiService } from '../services/api';

const STARTER_MESSAGE = {
  role: 'assistant',
  content: 'Hi! I run locally with Ollama. I can summarize hospital statistics or look up basic patient care-coordination details. I cannot diagnose or recommend treatment.',
};

const SUGGESTIONS = [
  'How many patients are admitted?',
  'Show me the Cardiology patients',
  'Look up patient P-101',
];

export default function AssistantPanel() {
  const [messages, setMessages] = useState([STARTER_MESSAGE]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState({ state: 'checking', message: 'Checking local Ollama...' });
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;
    apiService.getAssistantStatus()
      .then((result) => {
        if (active) setStatus({ state: result.status, message: result.message });
      })
      .catch((requestError) => {
        if (active) setStatus({ state: 'unavailable', message: requestError.message });
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, pending, error]);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || pending) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setPending(true);
    try {
      const result = await apiService.chatWithAssistant(nextMessages.slice(-20));
      setMessages([...nextMessages, { role: 'assistant', content: result.message }]);
    } catch (requestError) {
      setError(requestError.message || 'Could not reach the local assistant.');
    } finally {
      setPending(false);
    }
  };

  const isReady = status.state === 'ready';

  return (
    <section className="assistant-panel" aria-label="Local Ollama assistant">
      <div className="assistant-header">
        <div className="assistant-title">
          <span className="assistant-icon"><Bot size={19} /></span>
          <div>
            <h2>Local Hospital Assistant</h2>
            <p>Ollama · {status.model || 'llama3.2:3b'} · read-only patient tools</p>
          </div>
        </div>
        <span className={`assistant-status ${isReady ? 'ready' : 'not-ready'}`} title={status.message}>
          {isReady ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isReady ? 'Ready' : status.state === 'checking' ? 'Checking' : 'Offline'}
        </span>
      </div>

      {!isReady && (
        <div className="assistant-notice" role="status">
          {status.message}
        </div>
      )}

      <div className="assistant-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${index}-${message.role}`} className={`assistant-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {pending && (
          <div className="assistant-message assistant pending">
            <LoaderCircle size={15} className="animate-spin" /> Checking local tools...
          </div>
        )}
        {error && <div className="assistant-error" role="alert">{error}</div>}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="assistant-suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} disabled={pending || !isReady}>
              <Sparkles size={13} /> {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        className="assistant-form"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          aria-label="Message the local assistant"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={isReady ? 'Ask about hospital statistics or patient records...' : 'Start Ollama to chat...'}
          maxLength={4000}
          disabled={!isReady || pending}
        />
        <button type="submit" className="btn btn-primary" disabled={!isReady || pending || !input.trim()}>
          <Send size={15} /> Send
        </button>
      </form>
      <p className="assistant-disclaimer">Runs on your computer. Patient lookup omits contact details and diagnoses; do not use for clinical decisions.</p>
    </section>
  );
}
