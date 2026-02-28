import { useState, useEffect, useRef } from 'react';
import { generateRandomPrompt } from '../lib/pollinations';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Warning about temporary history
    if (!sessionStorage.getItem('genzee:chat_warned')) {
      alert('⚠️ Chat history is temporary. It will be cleared when you refresh or close this page.');
      sessionStorage.setItem('genzee:chat_warned', 'true');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Use Pollinations text API
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(input)}`);
      const text = await response.text();
      
      const aiMsg = { role: 'ai', content: text, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', content: 'Failed to get response. Please try again.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPrompt = async () => {
    const prompt = await generateRandomPrompt();
    setInput(prompt);
  };

  const clearChat = () => {
    if (confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ padding: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
        💬 Chat with AI • History is temporary
        <button onClick={clearChat} style={{ float: 'right', padding: '5px 10px', fontSize: '12px' }}>🗑️ Clear</button>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '48px' }}>💬</p>
              <p>Start a conversation!</p>
              <button onClick={handleRandomPrompt} style={{ marginTop: '15px', background: 'var(--bg-tertiary)' }}>
                🎲 Random Topic
              </button>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                <p style={{ marginTop: '5px' }}>{msg.content}</p>
              </div>
            ))
          )}
          {loading && <div className="chat-message ai"><em>AI is typing...</em></div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
