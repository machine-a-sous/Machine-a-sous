
/*
  Machine à sous avec animation de rouleaux.
  - Chaque tour coûte 1 crédit.
  - Trois symboles identiques : +5 crédits.
  - Deux symboles identiques : +2 crédits.
*/
(function () {
  const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
  let credits = 10;

  const creditSpan = document.getElementById("credit-value");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  const messageDiv = document.getElementById("message");
  const spinBtn = document.getElementById("spin");

  // Met à jour le compteur de crédits et l'état du bouton
  function updateCredits(amount) {
    credits += amount;
    creditSpan.textContent = credits;
    if (credits <= 0) {
      messageDiv.textContent = "Plus de crédits !";
      spinBtn.disabled = true;
    }
  }

  function evaluate(results) {
    const [a, b, c] = results;
    if (a === b && b === c) {
      updateCredits(5);
      messageDiv.textContent = "Jackpot ! +5 crédits";
    } else if (a === b || a === c || b === c) {
      updateCredits(2);
      messageDiv.textContent = "Presque ! +2 crédits";
    } else {
      messageDiv.textContent = "Raté...";
    }
  }

  // Lance l'animation puis s'arrête successivement pour chaque rouleau
  function spin() {
    if (credits <= 0 || spinBtn.disabled) return;

    updateCredits(-1); // coût du tour
    spinBtn.disabled = true; // empêche plusieurs clics
    messageDiv.textContent = "Bonne chance !";

    const stopTimes = [1000, 1500, 2000]; // temps (ms) avant arrêt de chaque rouleau
    const intervals = [];
    const results = new Array(reels.length);
    let stopped = 0;

    reels.forEach((reel, index) => {
      // Ajoute l'effet de flou
      reel.classList.add("spinning");

      // Change rapidement le symbole pour simuler la rotation
      intervals[index] = setInterval(() => {
        const randomSymb = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = randomSymb;
      }, 80);

      // Arrête le rouleau après stopTimes[index] millisecondes
      setTimeout(() => {
        clearInterval(intervals[index]);
        const finalSymb = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = finalSymb;
        reel.classList.remove("spinning");

        results[index] = finalSymb;
        stopped++;

        // Lorsque tous les rouleaux sont arrêtés, évalue le résultat et réactive le bouton
        if (stopped === reels.length) {
          evaluate(results);
          if (credits > 0) spinBtn.disabled = false;
        }
      }, stopTimes[index]);
    });
  }

  spinBtn.addEventListener("click", spin);
})();