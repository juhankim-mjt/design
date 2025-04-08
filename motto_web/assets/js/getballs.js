let multiBtn = document.getElementById("multi-draw-btn");
let singleBtn = document.getElementById("single-draw-btn");
const slotContainers = document.querySelectorAll(".ball-strip");

let finalLottoNumbers = [];
let isConfirmed = false;
let multiResults = [];
let currentDrawType = "single"; // "single" 또는 "multi"
let isAnimating = false;

function getColor(number) {
  if (number <= 10) return "#fbc400";
  if (number <= 20) return "#69c8f2";
  if (number <= 30) return "#ff7272";
  if (number <= 40) return "#aaa";
  return "#b0d840";
}

function getRandomNumbers() {
  const set = new Set();
  while (set.size < 6) {
    set.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(set).sort((a, b) => a - b);
}

async function animateBallSlot(slot, finalNumber, delay = 0) {
  const ballHeight = 30;
  const totalBalls = 20 + Math.floor(Math.random() * 10);
  const ballStrip = slot;

  ballStrip.style.transition = "none";
  ballStrip.style.transform = "translateY(0)";
  ballStrip.innerHTML = "";

  for (let i = 0; i < totalBalls; i++) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    const ball = document.createElement("div");
    ball.className = "lotto-ball";
    ball.textContent = "?";
    ball.style.backgroundColor = getColor(randomNum);
    Object.assign(ball.style, {
      height: "30px", width: "30px", lineHeight: "30px", textAlign: "center"
    });
    ballStrip.appendChild(ball);
  }

  const finalBall = document.createElement("div");
  finalBall.className = "lotto-ball";
  finalBall.textContent = finalNumber;
  finalBall.style.backgroundColor = getColor(finalNumber);
  Object.assign(finalBall.style, {
    height: "30px", width: "30px", lineHeight: "30px", textAlign: "center"
  });
  ballStrip.appendChild(finalBall);

  await new Promise(r => setTimeout(r, delay));
  const moveDistance = ballHeight * totalBalls;
  ballStrip.style.transition = "transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  ballStrip.style.transform = `translateY(-${moveDistance}px)`;
  await new Promise(r => setTimeout(r, 1200));
}

async function animateBalls(numbers = null) {
  isConfirmed = false;
  isAnimating = true;
  disableButtons(true);

  const drawNumbers = numbers || getRandomNumbers();

  for (let i = 0; i < slotContainers.length; i++) {
    await animateBallSlot(slotContainers[i], drawNumbers[i], i * 200);
  }

  if (currentDrawType === "single") {
    finalLottoNumbers = drawNumbers;
    console.log("1회 추첨 결과:", finalLottoNumbers);
  }

  updateButtons(currentDrawType);
  isAnimating = false;
  disableButtons(false);
}

function updateButtons(type) {
  let againBtn = document.getElementById("try-again-btn") || document.getElementById("multi-draw-btn");
  let confirmBtn = document.getElementById("confirm-draw-btn") || document.getElementById("single-draw-btn");

  againBtn.id = "try-again-btn";
  againBtn.innerHTML = `<i class="fas fa-redo" style="margin-right: 8px;"></i>다시 시도`;
  againBtn.removeAttribute("data-bs-toggle");
  againBtn.removeAttribute("data-bs-target");

  confirmBtn.id = "confirm-draw-btn";
  confirmBtn.innerHTML = `<i class="fas fa-check" style="margin-right: 8px;"></i>확정하기`;

  againBtn.replaceWith(againBtn.cloneNode(true));
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));

  document.getElementById("try-again-btn").addEventListener("click", () => {
    if (!isConfirmed && !isAnimating) {
      resetBalls();
      if (currentDrawType === "single") {
        animateBalls();
      } else {
        startMultiDraw();
      }
    }
  });

  document.getElementById("confirm-draw-btn").addEventListener("click", () => {
    if (isConfirmed) return;

    if (type === "single") {
      const modal = document.getElementById("modal-single");
      const instance = new bootstrap.Modal(modal);
      instance.show();
    } else if (type === "multi") {
      const modal = document.getElementById("modal-multi");
      const instance = new bootstrap.Modal(modal);
      instance.show();
    }

    isConfirmed = true;
  });
}

function resetBalls() {
  slotContainers.forEach(strip => {
    strip.style.transition = "none";
    strip.style.transform = "translateY(0)";
    strip.innerHTML = "";

    const defaultBall = document.createElement("div");
    defaultBall.className = "lotto-ball";
    defaultBall.textContent = "?";
    defaultBall.style.backgroundColor = "#eee";
    Object.assign(defaultBall.style, {
      height: "30px", width: "30px", lineHeight: "30px", textAlign: "center"
    });
    strip.appendChild(defaultBall);
  });
}

function disableButtons(disable = true) {
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = disable;
  });
}

singleBtn.addEventListener("click", () => {
  if (isAnimating) return;
  currentDrawType = "single";
  animateBalls();
});

multiBtn.addEventListener("click", () => {
  const modal = document.getElementById("modal-multi-check");
  const instance = new bootstrap.Modal(modal);
  instance.show();
});

document.getElementById("multi-draw-go-btn").addEventListener("click", () => {
  const modalEl = document.getElementById("modal-multi-check");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);

  const onHidden = async () => {
    modalEl.removeEventListener("hidden.bs.modal", onHidden);
    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());

    currentDrawType = "multi";
    await startMultiDraw();
  };

  modalEl.addEventListener("hidden.bs.modal", onHidden);
  modalInstance.hide();
});

async function startMultiDraw() {
  resetBalls();

  isAnimating = true;
  disableButtons(true);

  const firstNumbers = getRandomNumbers();
  await animateBalls(firstNumbers);

  multiResults = [firstNumbers];
  for (let i = 0; i < 9; i++) {
    multiResults.push(getRandomNumbers());
  }

  console.log("총 10세트 결과:", multiResults);
  isAnimating = false;
  disableButtons(false);
}

// 취소 버튼에 해당하는 ID가 있다고 가정할게 (예: multi-draw-cancel-btn)
document.getElementById("multi-draw-cancel-btn").addEventListener("click", () => {
  const modalEl = document.getElementById("modal-multi-check");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);

  const onHidden = () => {
    modalEl.removeEventListener("hidden.bs.modal", onHidden);
    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
  };

  modalEl.addEventListener("hidden.bs.modal", onHidden);
  modalInstance.hide(); // 수동으로 닫아줌
});