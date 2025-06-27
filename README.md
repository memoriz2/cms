# GreenSupia Project

GreenSupia는 관리자(Admin Portal)와 사용자(User Portal) 모두를 위한 통합 웹 서비스입니다.  
강력한 WYSIWYG 에디터와 안전한 백엔드, 반응형 프론트엔드로 구성되어 있습니다.

---

## 프로젝트 구성

- **Admin Portal**  
  관리자용 React 기반 포털. 인사말 등 콘텐츠를 WYSIWYG 에디터로 관리.
- **User Portal**  
  사용자용 Next.js 기반 포털. 실제 서비스 이용자에게 콘텐츠 제공.
- **Backend**  
  Spring Boot 기반 REST API 서버. 데이터 관리, 인증, 보안, 파일 업로드 등 제공.

---

## 주요 기능

### Admin Portal (관리자 포털)

- 인사말 등 콘텐츠 CRUD
- TipTap 기반 WYSIWYG 에디터 (색상, 폰트, 표, 이미지, 링크 등)
- XSS 방지(sanitize-html)
- 반응형 UI, 직관적 UX

### User Portal (사용자 포털)

- 인사말 등 실제 서비스 콘텐츠 노출
- Next.js 기반 SSR/CSR 지원
- 빠른 로딩, 모바일 대응

### Backend (Spring Boot)

- RESTful API 제공
- JPA 기반 DB 관리 (MySQL)
- 파일 업로드, 인증, 공통 엔티티 관리
- CORS, 보안, 로깅 등 인프라 설정

---

## 폴더 구조

```
greensupia/
  ├── backend/                # Spring Boot 백엔드
  │   ├── src/main/java/com/greensupia/backend/
  │   │   ├── entity/         # JPA 엔티티 (Greeting 등)
  │   │   ├── controller/     # REST API 컨트롤러
  │   │   ├── service/        # 비즈니스 로직
  │   │   └── repository/     # JPA 리포지토리
  │   └── resources/
  └── frontend/
      ├── admin-portal/       # 관리자 포털 (React)
      │   ├── src/components/ # GreetingManagement, TipTapEditor 등
      │   └── public/
      └── user-portal/        # 사용자 포털 (Next.js)
          ├── app/            # 페이지, 레이아웃, 스타일 등
          └── public/
```

---

## 실행 방법

### 1. 백엔드(Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

### 2. 관리자 포털(Admin Portal, React)

```bash
cd frontend/admin-portal
npm install
npm start
```

### 3. 사용자 포털(User Portal, Next.js)

```bash
cd frontend/user-portal
npm install
npm run dev
```

---

## 개발/기여 방법

1. 이슈 등록 및 브랜치 생성
2. 기능 개발 및 테스트
3. PR(Pull Request) 생성

---

## 기타

- **TipTap 에디터**:
  - 색상, 폰트, 표, 이미지, 링크 등 다양한 확장 지원
  - sanitize-html로 XSS 방지
- **DB**:
  - 인사말 등 콘텐츠는 `greeting` 테이블에 저장
  - content 컬럼은 `LONGTEXT`로 긴 내용 지원
- **확장성**:
  - 공통 엔티티(`EditorContent`)를 상속하여 다양한 콘텐츠 관리 가능
  - 관리자/사용자 포털 분리로 유지보수 용이

---
