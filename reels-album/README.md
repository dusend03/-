# 청룡의 축제 비하인드 앨범 (릴스 템플릿)

사진첩이 날아와 펼쳐지고, 한 장씩 넘어가면서 사진·영상과 설명(대제목/본문/페이지)이 나타나는 1080×1920 릴스 영상 템플릿.

## 사용법
1. 사진/영상을 `assets/` 폴더에 넣기 (JPG/PNG, MP4/MOV)
2. `content.js` 의 `pages` 에 파일 경로와 대제목·본문 입력 (표지 문구, 색상, 타이밍도 여기서 수정)
3. 미리보기: 폴더에서 `npx serve` 등으로 띄운 뒤 `album.html` 열기
4. 영상 만들기:
   ```bash
   node render.js                      # out/reels.mp4
   node render.js --bgm music.mp3      # 배경음악 포함 (끝에서 자동 페이드아웃)
   node render.js --still 5            # 5초 지점 한 장만 PNG로 확인
   ```
필요: Node + Playwright(Chromium), ffmpeg
