import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FestivalDetail.css'; // CSS 파일 import
const KAKAO_MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

const FestivalDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseFestival = location.state?.festival;
  const mapRef = useRef(null);
  const [festival, setFestival] = useState(baseFestival);

  // 상세정보 fetch
  useEffect(() => {
    if (!baseFestival?.contentid) return;
    fetch(`http://localhost:4000/api/festival-detail/${baseFestival.contentid}`)
      .then(res => res.json())
      .then(data => {
        const detail = data.response?.body?.items?.item;
        const detailItem = Array.isArray(detail) ? detail[0] : detail;
        if (detailItem) {
          setFestival({ ...baseFestival, ...detailItem });
        }
      });
  }, [baseFestival]);

  // 카카오 지도
  useEffect(() => {
    if (!festival || !festival.mapy || !festival.mapx) return;

    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current;
        const mapOption = {
          center: new window.kakao.maps.LatLng(Number(festival.mapy), Number(festival.mapx)),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(Number(festival.mapy), Number(festival.mapx)),
        });
      });
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = loadKakaoMap;

      return () => {
        document.head.removeChild(script);
      };
    } else {
      loadKakaoMap();
    }
  }, [festival]);

  if (!festival) return <div>축제 정보를 찾을 수 없습니다.</div>;

  const handlePlan = () => {
    navigate('/planner', { state: { festival } });
  };

  return (
    <div className="festival-detail-container">
      <div className="festival-detail-header">
        <h2 className="festival-detail-title">{festival.title}</h2>
        <button className="festival-detail-plan-btn" onClick={handlePlan}>
          이 축제로 여행 계획 세우기
        </button>
      </div>
      {festival.firstimage && (
        <img
          src={festival.firstimage}
          alt={festival.title}
          className="festival-detail-image"
        />
      )}
      <p>
        기간: {festival.eventstartdate || baseFestival.eventstartdate} ~ {festival.eventenddate || baseFestival.eventenddate}
      </p>
      <p>장소: {festival.addr1 || '주소 정보 없음'}</p>
      <div
        ref={mapRef}
        id="map"
        className="festival-detail-map"
      ></div>
      {festival.overview && (
        <div className="festival-detail-overview">
          <b>설명:</b>
          <div>{festival.overview}</div>
        </div>
      )}
    </div>
  );
};

export default FestivalDetail;