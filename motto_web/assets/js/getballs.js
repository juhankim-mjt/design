const slotContainers = document.querySelectorAll(".ball-strip");
const multiBtn = document.getElementById("multi-draw-btn");
const singleBtn = document.getElementById("single-draw-btn");

function getColor(number) {
  if (number >= 1 && number <= 10) return "#fbc400";
  if (number >= 11 && number <= 20) return "#69c8f2";
  if (number >= 21 && number <= 30) return "#ff7272";
  if (number >= 31 && number <= 40) return "#aaa";
  if (number >= 41 && number <= 45) return "#b0d840";
  return "#fff";
}

function getRandomNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

async function animateBallSlot(slot, finalNumber, delay = 0) {
  const ballHeight = 30;
  const totalBalls = 20 + Math.floor(Math.random() * 10);
  const ballStrip = slot;

  // reset style before animation
  ballStrip.style.transition = "none";
  ballStrip.style.transform = "translateY(0)";
  ballStrip.innerHTML = "";

  // 가짜 공: 색은 다양하고 내용은 "?"
  for (let i = 0; i < totalBalls; i++) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    const fakeBall = document.createElement("div");
    fakeBall.className = "lotto-ball";
    fakeBall.style.backgroundColor = getColor(randomNum);
    fakeBall.textContent = "?";
    fakeBall.style.height = "30px";
    fakeBall.style.width = "30px";
    fakeBall.style.lineHeight = "30px";
    fakeBall.style.textAlign = "center";
    ballStrip.appendChild(fakeBall);
  }

  // 진짜 공 (마지막에 숫자 보여주기)
  const finalBall = document.createElement("div");
  finalBall.className = "lotto-ball";
  finalBall.style.backgroundColor = getColor(finalNumber);
  finalBall.textContent = finalNumber;
  finalBall.style.height = "30px";
  finalBall.style.width = "30px";
  finalBall.style.lineHeight = "30px";
  finalBall.style.textAlign = "center";
  ballStrip.appendChild(finalBall);

  // 대기
  await new Promise((res) => setTimeout(res, delay));

  // 애니메이션
  const moveDistance = ballHeight * totalBalls;
  ballStrip.style.transition = "transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  ballStrip.style.transform = `translateY(-${moveDistance}px)`;

  // 애니메이션 끝날 때까지 대기
  await new Promise((res) => setTimeout(res, 1200));
}

async function animateBalls() {
  const numbers = getRandomNumbers();
  for (let i = 0; i < slotContainers.length; i++) {
    await animateBallSlot(slotContainers[i], numbers[i], i * 200);
  }

  // 버튼 상태 변경
  multiBtn.id = "try-again-btn";
  multiBtn.textContent = "다시 시도";

  singleBtn.id = "confirm-draw-btn";
  singleBtn.textContent = "확정하기";

  // 다시 시도 버튼 이벤트 설정
  const tryAgainBtn = document.getElementById("try-again-btn");
  tryAgainBtn.addEventListener("click", () => {
    resetBalls();
    animateBalls();
  });

  // 확정 버튼 이벤트 설정
  const confirmBtn = document.getElementById("confirm-draw-btn");
  confirmBtn.addEventListener("click", () => {
    alert("선택이 확정되었습니다!");
  });
}

function resetBalls() {
  slotContainers.forEach((strip) => {
    strip.style.transition = "none";
    strip.style.transform = "translateY(0)";
    strip.innerHTML = "";

    const defaultBall = document.createElement("div");
    defaultBall.className = "lotto-ball";
    defaultBall.textContent = "?";
    defaultBall.style.backgroundColor = "#eee";
    defaultBall.style.height = "30px";
    defaultBall.style.width = "30px";
    defaultBall.style.lineHeight = "30px";
    defaultBall.style.textAlign = "center";
    strip.appendChild(defaultBall);
  });
}

// 첫 발급 버튼 이벤트
singleBtn.addEventListener("click", animateBalls);