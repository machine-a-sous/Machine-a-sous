/* 
  NIVEAU 2 – MACHINE À SOUS (BTS)
  - Jeu avec mise variable
  - Animation des rouleaux
  - Gestion des crédits
  - Manipulation du DOM
*/

(function () {

  /* =======================
     DONNÉES DU JEU
  ======================= */
  const symbols = [
  "😍", "😍", "😍", "😍",
  "😂", "😂", "😂",
  "😊", "😊",
  "😘", "😎", "😁",
  "⭐" // rare
];
  let credits = 10;

  /* =======================
     RÉCUPÉRATION DU DOM
  ======================= */
  const creditSpan = document.getElementById("credit-value");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
    document.getElementById("reel4"),
  ];
  const messageDiv = document.getElementById("message");
  const spinBtn = document.getElementById("spin");
  const miseInput = document.getElementById("Mise");

  /* =======================
     SONS
  ======================= */
  const soundLose = new Audio("../sons/8-bit-video-game-fail-version-2-145478.mp3");
  const soundWin = new Audio("../sons/11l-victory_trumpet-1749704469779-358762.mp3");
  const soundSpin = new Audio("../sons/slot-machine-payout-81725.mp3");
  const soundJackpot = new Audio("../sons/winning-218995.mp3");

  /* =======================
     MISE À JOUR DES CRÉDITS
  ======================= */
  function updateCredits(amount) {
    credits += amount;
    creditSpan.textContent = credits;
    miseInput.max = credits;

    if (credits <= 0) {
      messageDiv.textContent = "💀 Plus de crédits !";
      spinBtn.disabled = true;
    }
  }

  /* =======================
     ÉVALUATION PLUS DIFFICILE
  ======================= */
  function evaluate(results, mise) {
    const starCount = counts["⭐"] || 0;

    if (starCount >= 3) {
      const win = mise * 10;
      updateCredits(win);
      messageDiv.textContent = `🌟 BONUS ÉTOILES ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundJackpot.play();
      return;
    }

    if (starCount === 2) {
      const win = mise * 5;
      updateCredits(win);
      messageDiv.textContent = `✨ Double étoile ! +${win} crédits`;
      soundWin.play();
      return;
    }

    const counts = {};

    // Compter les symboles
    results.forEach(symb => {
      counts[symb] = (counts[symb] || 0) + 1;
    });

    const values = Object.values(counts);
    messageDiv.className = "";

    // 4 identiques
    if (values.includes(4)) {
      const win = mise * 15;
      updateCredits(win);
      messageDiv.textContent = `🎉 SUPER JACKPOT ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundJackpot.play();
      return;
    }

    // 3 consécutifs
    if (values.includes(3)) {
      const win = mise * 6;
      updateCredits(win);
      messageDiv.textContent = `🔥 Très belle combinaison ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundWin.play();
      return;
    }

    // 2 paires
    if (values.length === 2 && values.includes(2)) {
      const win = mise * 4;
      updateCredits(win);
      messageDiv.textContent = `😎 Deux paires ! +${win} crédits`;
      messageDiv.classList.add("win");
      soundWin.play();
      return;
    }

    // 1 paire
    if (values.includes(2)) {
      updateCredits(mise);
      messageDiv.textContent = `🙂 Une paire, mise remboursée`;
      messageDiv.classList.add("neutral");
      return;
    }

    // Perte
    updateCredits(-mise);
    messageDiv.textContent = `😢 Perdu... -${mise} crédits`;
    messageDiv.classList.add("lose");
    soundLose.play();
  }

  /* =======================
     LANCEMENT DU JEU
  ======================= */
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

    const stopTimes = [1000, 1500, 2000, 2500];
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

  /* =======================
     ÉVÉNEMENTS
  ======================= */
  spinBtn.addEventListener("click", spin);

  miseInput.addEventListener("input", () => {
    if (miseInput.value > credits) miseInput.value = credits;
    if (miseInput.value < 1) miseInput.value = 1;
  });
  

})();
