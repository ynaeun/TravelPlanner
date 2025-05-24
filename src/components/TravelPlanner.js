import React, { useState } from 'react';

const TravelPlanner = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', content: '안녕하세요! 여행 계획을 도와드릴게요. 어디로 여행가고 싶으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, { type: 'ai', content: data.message }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="travel-planner">
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>{msg.content}</div>
        ))}
        {isLoading && <div className="message ai">AI가 답변 중...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="여행 계획에 대해 물어보세요..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>전송</button>
      </form>
    </div>
  );
};

export default TravelPlanner;