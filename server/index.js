require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Google Gemini 연동용 라이브러리
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ← 올바른 모듈명



const app = express();
app.use(cors());
app.use(express.json());

// 축제 데이터 프록시
app.get('/api/festivals', async (req, res) => {
  try {
    const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/searchFestival1', {
      params: {
        serviceKey: process.env.KTO_API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'TravelPlanner',
        _type: 'json',
        numOfRows: 10,
        pageNo: 1,
      }
    });
    const items = response.data.response.body.items.item;
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch festival data' });
  }
});

// Gemini LLM 프록시 (GoogleGenAI 사용)
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    

    const result = await model.generateContent(prompt);
    const aiMessage = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI 응답이 없습니다.';
    res.json({ message: aiMessage });
  } catch (error) {
      console.error('Gemini 오류:', error);
    res.status(500).json({ message: 'Gemini API 호출 실패', error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});