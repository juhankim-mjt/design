document.addEventListener('DOMContentLoaded', function () {
  const modalEl = document.getElementById('modal-campaign');

  modalEl.addEventListener('shown.bs.modal', function () {
    console.log('✅ 모달 열림! 룰렛 시작');

    const resultText = document.getElementById('resultText');
    const resultTextInfo = document.getElementById('resultTextInfo'); // 새로 추가된 info 영역
    const goBtn = document.getElementById('go-campaign-btn');
    const ticketNumEl = document.querySelector('.ticket-num-txt');

    if (!resultText || !goBtn || !ticketNumEl) {
      console.log('❌ 모달 내부 요소가 누락됨!');
      return;
    }

    // 초기화
    resultText.textContent = '룰렛을 돌리는 중입니다...';
    resultTextInfo.textContent = ''; // 처음엔 비워두기
    goBtn.classList.add('d-none');

    // 슬롯머신 숫자 애니메이션
    let finalResult = Math.floor(Math.random() * 10) + 1;
    let counter = 0;

    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 10) + 1;
      ticketNumEl.textContent = `${randomNum}장`;
      counter++;
      if (counter > 15) { // 약 1.5초 후 멈춤 (100ms * 16)
        clearInterval(interval);
        ticketNumEl.textContent = `${finalResult}장`;

        // 결과 표시 업데이트
        resultText.textContent = '캠페인이 도착했어요';
        resultTextInfo.textContent = '이용권은 해당 회차에서만 사용 가능합니다.';
        goBtn.classList.remove('d-none');

        console.log('🎯 최종 결과:', finalResult);
      }
    }, 100);
  });
});