# PulseTrack (펄스트랙)

**실시간 시장 데이터 대시보드** - 실시간 업데이트와 지능형 알림으로 시장의 맥박을 추적하세요

![기술 스택](https://img.shields.io/badge/Stack-MERN-green)
![라이센스](https://img.shields.io/badge/License-MIT-blue)

> 실시간 시장 데이터를 추적(Track)하여 투자자에게 핵심적인 맥박(Pulse) 정보를 제공하는 대시보드

PulseTrack은 인터랙티브 대시보드, 실시간 가격 업데이트, 지능형 가격 알림을 통해 투자자에게 필수적인 시장 인사이트를 제공하는 풀스택 실시간 시장 데이터 추적 애플리케이션입니다.

---

## 프로젝트 개요

MERN 스택 (MongoDB, Express.js, React, Node.js)으로 구축된 실시간 주식 시장 데이터 추적 웹 애플리케이션입니다.

---

## 주요 기능

### 핵심 기능
- **보안 인증 시스템**: JWT 기반 회원가입 및 로그인 시스템
- **관심 종목 관리**: 개인 관심 종목 등록, 수정, 삭제 (CRUD)
- **실시간 가격 업데이트**: Socket.io WebSocket을 통한 실시간 시세 정보
- **가격 알림**: 사용자 지정 가격 조건(상향/하향) 알림 설정
- **인터랙티브 차트**: Chart.js를 활용한 과거 시세 데이터 시각화
- **자동 데이터 수집**: Cron Job을 이용한 주기적 데이터 수집

### 주요 특징
- bcrypt를 이용한 안전한 비밀번호 해싱
- Socket.io 기반 실시간 대시보드
- 다양한 기간별 인터랙티브 차트 (7일, 1개월, 3개월)
- 브라우저 푸시 알림 지원
- MongoDB를 활용한 유연한 데이터 저장
- RESTful API 아키텍처
- 반응형 웹 디자인

---

## 기술 스택

| 구분 | 기술 | 용도 |
|------|------|------|
| **프론트엔드** | React 18 | 동적 UI 및 상태 관리 |
| **백엔드** | Node.js + Express | 비동기 API 서버 및 비즈니스 로직 |
| **데이터베이스** | MongoDB + Mongoose | NoSQL 데이터 모델링 및 저장 |
| **실시간 통신** | Socket.io | WebSocket 기반 실시간 업데이트 |
| **데이터 시각화** | Chart.js + react-chartjs-2 | 인터랙티브 차트 |
| **스케줄링** | node-cron | 자동 데이터 수집 |
| **인증** | JWT + bcrypt | 보안 인증 |

---

## 프로젝트 구조

```
PulseTrack/
├── backend/                          # 백엔드 (Node.js + Express)
│   ├── config/
│   │   └── db.js                     # MongoDB 연결 설정
│   ├── controllers/
│   │   ├── alertController.js        # 가격 알림 로직
│   │   ├── authController.js         # 인증 로직
│   │   ├── marketController.js       # 시장 데이터 로직
│   │   └── watchlistController.js    # 관심종목 CRUD
│   ├── middleware/
│   │   ├── auth.js                   # JWT 인증 미들웨어
│   │   └── errorHandler.js           # 에러 처리
│   ├── models/
│   │   ├── MarketData.js             # 시장 데이터 스키마
│   │   ├── PriceAlert.js             # 가격 알림 스키마
│   │   ├── User.js                   # 사용자 스키마
│   │   └── Watchlist.js              # 관심종목 스키마
│   ├── routes/
│   │   ├── alertRoutes.js            # 알림 라우트
│   │   ├── authRoutes.js             # 인증 라우트
│   │   ├── marketRoutes.js           # 시장 데이터 라우트
│   │   └── watchlistRoutes.js        # 관심종목 라우트
│   ├── services/
│   │   ├── alertService.js           # 알림 체크 서비스
│   │   ├── cronService.js            # 스케줄 작업
│   │   ├── financialApiService.js    # 외부 API 연동
│   │   └── socketService.js          # Socket.io 서버
│   ├── utils/
│   │   └── generateToken.js          # JWT 토큰 생성
│   ├── .env.example                  # 환경변수 예시
│   ├── package.json                  # 의존성 설정
│   └── server.js                     # 메인 서버 진입점
│
├── frontend/                         # 프론트엔드 (React)
│   ├── public/
│   │   └── index.html                # HTML 템플릿
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertsPanel.js        # 알림 관리 UI
│   │   │   ├── AlertsPanel.css
│   │   │   ├── Auth.css              # 인증 페이지 스타일
│   │   │   ├── Dashboard.js          # 메인 대시보드
│   │   │   ├── Dashboard.css
│   │   │   ├── Login.js              # 로그인 페이지
│   │   │   ├── PriceChart.js         # Chart.js 차트 컴포넌트
│   │   │   ├── PriceChart.css
│   │   │   ├── Register.js           # 회원가입 페이지
│   │   │   ├── Watchlist.js          # 관심종목 UI
│   │   │   └── Watchlist.css
│   │   ├── context/
│   │   │   ├── AuthContext.js        # 인증 상태 관리
│   │   │   └── SocketContext.js      # Socket.io 클라이언트
│   │   ├── services/
│   │   │   └── api.js                # API 서비스 레이어
│   │   ├── App.js                    # 메인 앱 및 라우팅
│   │   ├── App.css
│   │   ├── index.js                  # React 진입점
│   │   └── index.css                 # 전역 스타일
│   ├── .env.example                  # 환경변수 예시
│   └── package.json                  # 의존성 설정
│
├── .gitignore                        # Git 무시 파일
└── README.md                         # 프로젝트 문서
```

---

## 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- MongoDB (v5 이상)
- npm 또는 yarn

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/KTH0920/Pulse-Track.git
cd Pulse-Track
```

2. **백엔드 설정**
```bash
cd backend
npm install

# 환경변수 파일 생성
cp .env.example .env

# .env 파일을 열어 설정 수정
# 필수: MONGODB_URI, JWT_SECRET
```

3. **프론트엔드 설정**
```bash
cd ../frontend
npm install

# 환경변수 파일 생성
cp .env.example .env

# 로컬 개발 시 기본값 사용 가능
```

### 환경 설정

#### 백엔드 (.env)
```env
NODE_ENV=development
PORT=5000

# MongoDB 연결 문자열
MONGODB_URI=mongodb://localhost:27017/pulsetrack

# JWT 비밀키 (실제 운영 시 강력한 랜덤 문자열 사용)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# 외부 금융 API (선택사항 - 기본적으로 Mock 데이터 사용)
FINANCIAL_API_KEY=your_api_key_here
FINANCIAL_API_BASE_URL=https://api.example.com

# CORS 허용 클라이언트 URL
CLIENT_URL=http://localhost:3000

# Cron 스케줄 (5분마다)
DATA_FETCH_SCHEDULE=*/5 * * * *
```

#### 프론트엔드 (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
```

### 애플리케이션 실행

1. **MongoDB 시작** (로컬 설치 시)
```bash
mongod
```

2. **백엔드 서버 시작**
```bash
cd backend
npm run dev  # 개발 모드 (nodemon 사용)
# 또는
npm start    # 프로덕션 모드
```

백엔드 실행 주소: http://localhost:5000

3. **프론트엔드 시작**
```bash
cd frontend
npm start
```

프론트엔드 실행 주소: http://localhost:3000

---

## API 문서

### 인증 API
- `POST /api/auth/register` - 신규 사용자 등록
- `POST /api/auth/login` - 사용자 로그인
- `GET /api/auth/profile` - 사용자 프로필 조회 (인증 필요)

### 관심종목 API
- `GET /api/watchlist` - 관심종목 목록 조회 (인증 필요)
- `POST /api/watchlist` - 관심종목 추가 (인증 필요)
- `PUT /api/watchlist/:id` - 관심종목 수정 (인증 필요)
- `DELETE /api/watchlist/:id` - 관심종목 삭제 (인증 필요)

### 가격 알림 API
- `GET /api/alerts` - 알림 목록 조회 (인증 필요)
- `POST /api/alerts` - 알림 생성 (인증 필요)
- `PUT /api/alerts/:id` - 알림 수정 (인증 필요)
- `DELETE /api/alerts/:id` - 알림 삭제 (인증 필요)

### 시장 데이터 API
- `GET /api/market/:symbol` - 특정 종목 현재가 조회 (인증 필요)
- `GET /api/market/:symbol/history` - 과거 시세 조회 (인증 필요)
- `GET /api/market/search?q=query` - 종목 검색 (인증 필요)
- `POST /api/market/bulk` - 복수 종목 일괄 조회 (인증 필요)

---

## Socket.io 이벤트

### 클라이언트 → 서버
- `subscribe_symbol` - 특정 종목 구독
- `unsubscribe_symbol` - 종목 구독 해제

### 서버 → 클라이언트
- `price_update` - 실시간 가격 업데이트
- `price_alert` - 가격 알림 발생
- `market_update` - 전체 시장 데이터 브로드캐스트

---

## 사용 가이드

### 1. 회원가입/로그인
- 새 계정 생성 또는 기존 계정으로 로그인
- JWT 토큰이 localStorage에 저장되어 세션 유지

### 2. 관심종목 추가
- 관심종목 패널에서 **+** 버튼 클릭
- 종목 심볼 (예: AAPL) 과 회사명 입력
- 관심종목 목록에 실시간 가격과 함께 표시

### 3. 차트 보기
- 관심종목 목록에서 종목 클릭
- 중앙 패널에서 인터랙티브 가격 차트 확인
- 7일, 1개월, 3개월 기간 전환 가능

### 4. 가격 알림 설정
- 관심종목에서 종목 선택
- 알림 패널의 **+** 버튼 클릭
- 목표 가격과 조건 (상향/하향) 설정
- 조건 충족 시 브라우저 알림 수신

### 5. 실시간 업데이트
- "Live" 표시로 연결 상태 확인
- WebSocket을 통해 자동으로 가격 업데이트
- 차트에 최신 데이터 반영

---

## 상세 기능 설명

### 실시간 가격 업데이트
- Socket.io가 지속적인 WebSocket 연결 유지
- 관심종목 자동 구독
- 5분마다 실시간 가격 업데이트 (설정 가능)
- 헤더에 연결 상태 표시

### 인터랙티브 차트
- 그라데이션 채움이 적용된 라인 차트
- 다양한 기간 선택: 7일, 1개월, 3개월
- 마우스 오버 시 상세 가격 정보 툴팁
- 시가, 고가, 저가, 거래량 통계 패널

### 가격 알림 시스템
- 사용자 지정 가격 임계값 설정
- 상향/하향 조건 선택
- Cron Job을 통한 자동 트리거
- 브라우저 푸시 알림
- 알림 이력 추적

### 데이터 수집
- 자동화된 Cron Job이 시장 데이터 수집
- 설정 가능한 스케줄 (기본값: 5분마다)
- MongoDB에 과거 데이터 저장
- 90일 이상 오래된 데이터 자동 삭제

---

## 커스터마이징

### 실제 금융 API 연동

`backend/services/financialApiService.js`의 Mock 데이터를 실제 API로 교체:

```javascript
async getQuote(symbol) {
  // Alpha Vantage 예시
  const response = await axios.get(
    `https://www.alphavantage.co/query`,
    {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: this.apiKey
      }
    }
  );

  // 데이터 파싱 및 반환
  return {
    symbol: symbol,
    price: parseFloat(response.data['Global Quote']['05. price']),
    // ... 다른 필드 매핑
  };
}
```

### 데이터 수집 주기 변경

`backend/.env` 파일 수정:
```env
# 1분마다
DATA_FETCH_SCHEDULE=* * * * *

# 1시간마다
DATA_FETCH_SCHEDULE=0 * * * *

# 30분마다
DATA_FETCH_SCHEDULE=*/30 * * * *
```

---

## 배포 가이드

### 백엔드 배포 (AWS/Heroku/Railway)

1. 환경변수 설정
2. MongoDB 접근 가능 여부 확인
3. CLIENT_URL을 프로덕션 프론트엔드 URL로 업데이트
4. 배포 후 백엔드 URL 기록

### 프론트엔드 배포 (Vercel/Netlify)

1. `.env`에 프로덕션 백엔드 URL 설정
2. 빌드: `npm run build`
3. `build` 폴더 배포
4. 호스팅 플랫폼에서 환경변수 설정

### 프로덕션 체크리스트
- [ ] 강력한 JWT_SECRET 사용
- [ ] 프로덕션 MongoDB 설정 (MongoDB Atlas)
- [ ] 프로덕션 도메인만 CORS 허용
- [ ] Rate Limiting 미들웨어 추가
- [ ] HTTPS 활성화
- [ ] 실제 금융 API 설정
- [ ] 모니터링 및 로깅 설정
- [ ] 정기 데이터베이스 백업

---

## 향후 개선 사항

- [ ] 캔들스틱 차트 추가
- [ ] 포트폴리오 추적 및 손익 계산
- [ ] 뉴스 피드 연동
- [ ] 소셜 기능 (관심종목 공유)
- [ ] 모바일 앱 (React Native)
- [ ] 이메일 알림
- [ ] 다양한 알림 조건 (변동률, 거래량)
- [ ] 기술적 지표 (MA, RSI, MACD)
- [ ] CSV 데이터 내보내기
- [ ] 다크 모드 테마

---

## 문제 해결

### 백엔드가 시작되지 않을 때
- MongoDB 실행 확인: `mongosh` 또는 `mongo`
- .env 파일 존재 및 값 확인
- 포트 5000 사용 여부 확인

### 프론트엔드가 백엔드에 연결되지 않을 때
- 백엔드가 포트 5000에서 실행 중인지 확인
- frontend/package.json의 proxy 설정 확인
- .env의 REACT_APP_API_URL 확인

### Socket.io 연결 실패 시
- 백엔드의 CORS 설정 확인
- REACT_APP_WS_URL이 백엔드 URL과 일치하는지 확인
- 브라우저 콘솔에서 에러 확인

### 알림이 트리거되지 않을 때
- Cron Job 실행 확인 (콘솔 로그)
- 종목이 관심목록에 있는지 확인
- 알림 조건과 목표 가격 확인

---

## 라이센스

MIT 라이센스 - 학습 및 개발 목적으로 자유롭게 사용 가능

---

## 제작자

풀스택 MERN 학습 프로젝트로 제작됨

---

## 감사의 글

- React 및 Chart.js 커뮤니티
- Socket.io 공식 문서
- MongoDB University
- Express.js 팀

---

**Happy Trading! 성공적인 투자를 기원합니다!**
