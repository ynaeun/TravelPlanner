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
    const response = await axios.get('http://apis.data.go.kr/B551011/EngService1/areaBasedList1?numOfRows=12&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=%2BWnLF9LEv2%2BFlnclGOqrnMap89wzaDIicevOjW0I9AkKnEUYsPAWTfb1A8h21ycHoCZhrwKw3PPO%2Bj4wDvqdAw%3D%3D&listYN=Y&arrange=A&contentTypeId=85&areaCode=&sigunguCode=&cat1=A02&cat2=A0207&cat3=', {
      params: {
        serviceKey:'+WnLF9LEv2+FlnclGOqrnMap89wzaDIicevOjW0I9AkKnEUYsPAWTfb1A8h21ycHoCZhrwKw3PPO+j4wDvqdAw==',
        MobileOS: 'ETC',
        MobileApp: 'TravelPlanner',
        _type: 'json',
        numOfRows: 10,
        pageNo: 1,
      }
    });
        if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
      console.error('공공데이터 포털 API 응답 형식이 예상과 다릅니다:', response.data);
      return res.status(500).json({ error: '공공데이터 포털 응답 형식이 올바르지 않습니다.' });
    }

    // 축제 상세정보 프록시
app.get('/api/festival-detail/:contentid', async (req, res) => {
  const { contentid } = req.params;
  try {
    const response = await axios.get('http://apis.data.go.kr/B551011/EngService1/detailIntro1?ServiceKey=%2BWnLF9LEv2%2BFlnclGOqrnMap89wzaDIicevOjW0I9AkKnEUYsPAWTfb1A8h21ycHoCZhrwKw3PPO%2Bj4wDvqdAw%3D%3D&contentTypeId=85&contentId=1057670&MobileOS=ETC&MobileApp=AppTest', {
      params: {
        ServiceKey: '%2BWnLF9LEv2%2BFlnclGOqrnMap89wzaDIicevOjW0I9AkKnEUYsPAWTfb1A8h21ycHoCZhrwKw3PPO%2Bj4wDvqdAw%3D%3D',
        contentTypeId: 85,
        contentId: contentid,
        MobileOS: 'ETC',
        MobileApp: 'TravelPlanner',
        _type: 'json',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('축제 상세정보 가져오기 실패:', error.message);
    res.status(500).json({ error: '축제 상세정보를 가져오는 데 실패했습니다.' });
  }
});

    // 'item' 속성이 배열이 아닐 경우 (데이터가 하나이거나 아예 없을 경우)를 처리
  
   let items = response.data.response.body.items.item;
const finalItems = Array.isArray(items) ? items : (items ? [items] : []);
res.json(finalItems);

    res.json(finalItems);
  } catch (error) {
    // --- 이 부분이 가장 중요합니다! 에러의 상세 정보를 서버 콘솔에 출력 ---
    console.error('축제 데이터 가져오기 실패:', error.message); // 에러 메시지
    if (error.response) {
      // Axios 에러일 경우, 응답 데이터와 상태 코드를 확인
      console.error('외부 API 응답 상태:', error.response.status);
      console.error('외부 API 응답 데이터:', error.response.data);
    }
    res.status(500).json({ error: '축제 데이터를 가져오는 데 실패했습니다.' });
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