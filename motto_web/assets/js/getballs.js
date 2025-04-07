 const slotContainers = document.querySelectorAll(".slot-container");
  const drawBtn = document.getElementById("draw-btn");
  const redrawBtn = document.getElementById("redraw-btn");
  const confirmBtn = document.getElementById("confirm-btn");

  // 색상 구하는 함수
  function getColor(number) {
    if (number >= 1 && number <= 10) return "#fbc400";
    if (number >= 11 && number <= 20) return "#69c8f2";
    if (number >= 21 && number <= 30) return "#ff7272";
    if (number >= 31 && number <= 40) return "#aaa";
    if (number >= 41 && number <= 45) return "#b0d840";
    return "#fff";
  }

  // 랜덤 번호 6개 생성
  function getRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  // 슬롯 하나 애니메이션 (자연스럽게 떨어지는 느낌)
  async function animateBallSlot(slot, finalNumber, delay = 0) {
    const ball = slot.querySelector(".lotto-ball");
    let frame = 0;
    const totalFrames = 20 + Math.floor(Math.random() * 10); // 각 슬롯별로 다르게

    await new Promise((res) => setTimeout(res, delay)); // 슬롯 간 시간차

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        ball.textContent = randomNum;
        ball.style.backgroundColor = getColor(randomNum);
        ball.style.transition = "transform 0.1s ease";
        ball.style.transform = "translateY(20px)";
        
        setTimeout(() => {
          ball.style.transform = "translateY(0)";
        }, 50);

        frame++;
        if (frame >= totalFrames) {
          clearInterval(interval);
          // 최종 숫자로 고정
          ball.textContent = finalNumber;
          ball.style.backgroundColor = getColor(finalNumber);
          resolve();
        }
      }, 80);
    });
  }

  // 전체 애니메이션 실행
  async function animateBalls() {
    const numbers = getRandomNumbers();
    for (let i = 0; i < slotContainers.length; i++) {
      await animateBallSlot(slotContainers[i], numbers[i], i * 100); // 시간차 연출
    }

    drawBtn.classList.add("d-none");
    redrawBtn.classList.remove("d-none");
    confirmBtn.classList.remove("d-none");
  }

  // 다시 그리기
  function resetBalls() {
    slotContainers.forEach((slot) => {
      const ball = slot.querySelector(".lotto-ball");
      ball.textContent = "?";
      ball.style.backgroundColor = "#eee";
    });

    drawBtn.classList.remove("d-none");
    redrawBtn.classList.add("d-none");
    confirmBtn.classList.add("d-none");
  }

  // 버튼 이벤트
  drawBtn.addEventListener("click", animateBalls);
  redrawBtn.addEventListener("click", () => {
    resetBalls();
    animateBalls();
  });
  confirmBtn.addEventListener("click", () => {
    alert("선택이 확정되었습니다!");
  });