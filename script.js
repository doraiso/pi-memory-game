const PI_DIGITS =
  "14159265358979323846264338327950288419716939937510" +
  "58209749445923078164062862089986280348253421170679" +
  "82148086513282306647093844609550582231725359408128" +
  "48111745028410270193852110555964462294895493038196" +
  "44288109756659334461284756482337867831652712019091" +
  "45648566923460348610454326648213393607260249141273" +
  "72458700660631558817488152092096282925409171536436" +
  "78925903600113305305488204665213841469519415116094" +
  "33057270365759591953092186117381932611793105118548" +
  "07446237996274956735188575272489122793818301194912" +
  "98336733624406566430860213949463952247371907021798" +
  "60943702770539217176293176752384674818467669405132" +
  "00056812714526356082778577134275778960917363717872" +
  "14684409012249534301465495853710507922796892589235" +
  "42019956112129021960864034418159813629774771309960" +
  "51870721134999999837297804995105973173281609631859" +
  "50244594553469083026425223082533446850352619311881" +
  "71010003137838752886587533208381420617177669147303" +
  "59825349042875546873115956286388235378759375195778" +
  "18577805321712268066130019278766111959092164201989";

const currentPiEl = document.getElementById("currentPi");
const questionEl = document.getElementById("question");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const rankEl = document.getElementById("rank");
const resultEl = document.getElementById("result");
const retryButton = document.getElementById("retryButton");
const answerButton = document.getElementById("answerButton");

let correctDigits = "";
let isGameOver = false;
let bestScore = Number(localStorage.getItem("piMemoryBestScore")) || 0;
const DEBUG_FORCE_100_DIGITS = false; // デバッグ用: 結果表示で円周率100桁を表示

function getRank(score) {
  if (score === 0) return "まだ円";
  if (score <= 3) return "円周率入門者";
  if (score <= 9) return "理系っぽい人";
  if (score <= 49) return "暗記勢";
  if (score <= 99) return "円周率マニア";
  return "πの住人";
}

function updateScreen() {
  const previewLimit = 80;
  const preview = correctDigits.length > previewLimit
    ? correctDigits.slice(0, previewLimit) + "…"
    : correctDigits;

  currentPiEl.textContent = "3." + preview;
  questionEl.textContent = `小数点第${correctDigits.length + 1}位は？`;
  scoreEl.textContent = correctDigits.length;
  bestScoreEl.textContent = bestScore;
  rankEl.textContent = getRank(correctDigits.length);
}

function setMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`.trim();
}

function finishGame(correctAnswer) {
  isGameOver = true;
  answerInput.disabled = true;
  answerButton.disabled = true;
  retryButton.classList.remove("hidden");

  const score = correctDigits.length;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("piMemoryBestScore", String(bestScore));
  }

  const revealedPi = DEBUG_FORCE_100_DIGITS
    ? `3.${PI_DIGITS.slice(0, 100)}...`
    : `3.${correctDigits}${correctAnswer}...`;
  resultEl.innerHTML = `
    <strong>不正解！</strong><br>
    あなたは円周率を小数点以下<strong>${score}桁</strong>まで覚えています。<br>
    正解は <strong>${correctAnswer}</strong> でした。<br>
    称号は <strong>${getRank(score)}</strong> です。<br>
    円周率：<span class="pi-result">${revealedPi}</span>
  `;
  resultEl.classList.remove("hidden");
  setMessage("ゲーム終了。また挑戦してみよう！", "wrong");
  updateScreen();
}

function judgeAnswer(answer) {
  if (isGameOver) return;

  const expectedDigit = PI_DIGITS[correctDigits.length];

  if (answer === expectedDigit) {
    correctDigits += answer;
    setMessage("正解！その調子！", "correct");
    answerInput.value = "";
    updateScreen();

    if (correctDigits.length >= PI_DIGITS.length) {
      isGameOver = true;
      resultEl.innerHTML = `
        <strong>完全クリア！</strong><br>
        用意した${PI_DIGITS.length}桁をすべて正解しました。<br>
        これはもう <strong>πの住人</strong> です。
      `;
      resultEl.classList.remove("hidden");
      retryButton.classList.remove("hidden");
      answerInput.disabled = true;
      answerButton.disabled = true;
    }
    return;
  }

  finishGame(expectedDigit);
}

answerInput.addEventListener("input", () => {
  answerInput.value = answerInput.value.replace(/[^0-9]/g, "").slice(0, 1);
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();

  if (!answer) {
    setMessage("0〜9の数字を1つ入力してね。", "wrong");
    answerInput.focus();
    return;
  }

  judgeAnswer(answer);
  answerInput.focus();
});

retryButton.addEventListener("click", () => {
  correctDigits = "";
  isGameOver = false;
  answerInput.disabled = false;
  answerButton.disabled = false;
  answerInput.value = "";
  resultEl.classList.add("hidden");
  retryButton.classList.add("hidden");
  setMessage("数字を1つ入力してね。", "");
  updateScreen();
  answerInput.focus();
});

updateScreen();
answerInput.focus();
