import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const TravelPlanner = () => {
  const location = useLocation();
  const festival = location.state?.festival;

  const [messages, setMessages] = useState([
    { type: 'ai', content: '안녕하세요! 여행 계획을 도와드릴게요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // sendPrompt를 useCallback으로 감싸기
  const sendPrompt = useCallback(async (promptText) => {
    setMessages(prev => [...prev, { type: 'user', content: promptText }]);
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  }, []);

  // 축제 정보가 있으면 자동으로 AI에게 프롬프트 전송 (최초 1회만)
  useEffect(() => {
    if (festival) {
      const prompt = `
"${festival.title}" 축제에 맞는 여행 계획을 추천해줘.
축제 정보:
- 기간: ${festival.eventstartdate} ~ ${festival.eventenddate}
- 위치: ${festival.addr1}
${festival.overview ? '- 설명: ' + festival.overview : ''}
      `;
      sendPrompt(prompt);
    }
    // eslint-disable-next-line
  }, [festival, sendPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendPrompt(input);
  };

  return (
    <div>
      <h2>AI 여행 플래너</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '8px 0', color: msg.type === 'ai' ? 'blue' : 'black' }}>
            <b>{msg.type === 'ai' ? 'AI' : '나'}:</b> {msg.content}
          </div>
        ))}
        {isLoading && <div>AI가 답변 중...</div>}
      </div>
      <form onSubmit={handleSubmit}>
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