/*
  NIVEAU 3 – MACHINE À SOUS (BTS)
  - 5 rouleaux
  - Mise variable
  - Algorithme avancé d'évaluation
  - Manipulation du DOM
*/

(function () {

  /* =====================
     DONNÉES
  ===================== */
  const symbols = ["😍", "😂", "😊", "😘", "😎", "😁"];
  let credits = 10;

  /* =====================
     DOM
  ===================== */
  const creditSpan = document.getElementById("credit-value");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
    document.getElementById("reel4"),
    document.getElementById("reel5"),
  ];
  const messageDiv = document.getElementById("message");
  const spinBtn = document.getElementById("spin");
  const miseInput = document.getElementById("Mise");

  /* =====================
     SONS
  ===================== */
  const soundLose = new Audio("../sons/8-bit-video-game-fail-version-2-145478.mp3");
  const soundWin = new Audio("../sons/11l-victory_trumpet-1749704469779-358762.mp3");
  const soundSpin = new Audio("../sons/slot-machine-payout-81725.mp3");
  const soundJackpot = new Audio("../sons/winning-218995.mp3");

  /* =====================
     CRÉDITS
  ===================== */
  function updateCredits(amount) {
    credits += amount;
    creditSpan.textContent = credits;
    miseInput.max = credits > 0 ? credits : 1;

    if (credits <= 0) {
      messageDiv.textContent = "💀 Plus de crédits !";
      spinBtn.disabled = true;
      miseInput.disabled = true;
    }
  }

  /* =====================
     ÉVALUATION AVANCÉE
  ===================== */
  function evaluate(results, mise) {
    const counts = {};

    // Comptage des symboles
    results.forEach(symb => {
      counts[symb] = (counts[symb] || 0) + 1;
    });

    const maxSame = Math.max(...Object.values(counts));
    messageDiv.className = "";

    if (maxSame === 5) {
      const win = mise * 20;
      updateCredits(win);
      messageDiv.textContent = `🔥 SUPER JACKPOT ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundJackpot.play();

    } else if (maxSame === 4) {
      const win = mise * 10;
      updateCredits(win);
      messageDiv.textContent = `🎉 Très gros gain ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundWin.play();

    } else if (maxSame === 3) {
      const win = mise * 5;
      updateCredits(win);
      messageDiv.textContent = `😄 Beau gain ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundWin.play();

    } else if (maxSame === 2) {
      const win = mise * 2;
      updateCredits(win);
      messageDiv.textContent = `🙂 Petite paire +${win} crédits`;
      messageDiv.classList.add("neutral");

    } else {
      updateCredits(-mise);
      messageDiv.textContent = `😢 Raté... -${mise} crédits`;
      messageDiv.classList.add("lose");
      soundLose.play();
    }
  }

  /* =====================
     JEU
  ===================== */
  function spin() {
    const mise = parseInt(miseInput.value, 10);

    if (isNaN(mise) || mise < 1 || mise > credits) {
      messageDiv.textContent = "❌ Mise invalide";
      messageDiv.className = "lose";
      return;
    }

    updateCredits(-mise);
    spinBtn.disabled = true;
    messageDiv.textContent = "🎰 La machine tourne...";
    soundSpin.currentTime = 0;
    soundSpin.play();

    const stopTimes = [1000, 1500, 2000, 2500, 3000];
    const results = new Array(reels.length);
    let stopped = 0;

    reels.forEach((reel, index) => {
      reel.classList.add("spinning");

      const interval = setInterval(() => {
        reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      }, 80);

      setTimeout(() => {
        clearInterval(interval);
        const finalSymb = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = finalSymb;
        reel.classList.remove("spinning");

        results[index] = finalSymb;
        stopped++;

        if (stopped === reels.length) {
          evaluate(results, mise);
          if (credits > 0) spinBtn.disabled = false;
        }
      }, stopTimes[index]);
    });
  }

  /* =====================
     ÉVÉNEMENTS
  ===================== */
  spinBtn.addEventListener("click", spin);

  miseInput.addEventListener("input", () => {
    if (miseInput.value > credits) miseInput.value = credits;
    if (miseInput.value < 1) miseInput.value = 1;
  });

})();
