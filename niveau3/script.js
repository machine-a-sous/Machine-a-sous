
(function () {
  const symbols = ["😍", "😂", "😊", "😘", "😎", "😁"];
  let credits = 10;

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
  const miseBtn = document.getElementById("Mise");
  const rater = new Audio("../sons/8-bit-video-game-fail-version-2-145478.mp3");
  const gain = new Audio("../sons/11l-victory_trumpet-1749704469779-358762.mp3");
  const slot = new Audio("../sons/slot-machine-payout-81725.mp3");
  const victoire = new Audio("../sons/winning-218995.mp3");
  


  // Met à jour le compteur de crédits et l'état du bouton
  function updateCredits(amount) {
    credits += amount;
    creditSpan.textContent = credits;
    miseBtn.max =credits>1?  credits:1;
    if (credits <= 0) {
      messageDiv.textContent = "Plus de crédits !";
      spinBtn.disabled = true;
      miseBtn.disabled = true;
    }
  }

  function evaluate(results,Mise) {
   
    const [a, b, c,d,e] = results;
    if (a === b && b === c && c===d && d===e) {
       const win=Mise*15;
      updateCredits(win);
      messageDiv.textContent = `Jackpot ! + ${win} crédits`;
      console.log(win);
      victoire.play();
        } else if ((a === b && b === c && c === d) || (a === b && b === c && c === e) || (b === c && c === d && d === e )|| (a === b && b === d  && d === e )|| (a === c && c === d && d === e)) {
            const win=Mise*10;
            
      updateCredits(win);
      messageDiv.textContent = `Jackpot ! + ${win} crédits`;
      gain.play();
      console.log(win);
       } else if ((a === b && b === c )|| (a === b && b ===d )|| (a === b && b === e )||(b === d && d === c) || (b === c && c === e )|| (a === d && d === c ) || (a === c && c=== e )|| (a === d && d===e )|| (d === b && b === e )||(d === c && c=== e )) {
          const win=Mise*5;

      updateCredits(win);
      messageDiv.textContent = `Jackpot ! + ${win} crédits`;
      console.log(win);
      gain.play();
     
    } else if (a === b || a === c || a === d || a === e || b === d || b === c || b === e || c=== d || e === c || d === e) {
           const win=Mise*2;
      updateCredits(win);
      messageDiv.textContent = `Jackpot ! + ${win} crédits`;
      console.log(win);
      gain.play();
    } else {
       const win=Mise*-2;
      updateCredits(win);
      messageDiv.textContent = `Raté ...! + ${win} crédits`;
      console.log(win);
      rater.play();
  }
        console.log(Mise);
} 

  // Lance l'animation puis s'arrête successivement pour chaque rouleau
  function spin() {
    const Mise =parseInt(miseBtn.value,10);
    if(isNaN(Mise )|| Mise <1||Mise>credits){
      alert("erreur de mise, réessayer");
      return;
    }
    slot.currentTime=0;
    slot.play();
  
    updateCredits(-Mise); // coût du tour
    spinBtn.disabled = true; // empêche plusieurs clics
    messageDiv.textContent = "Bonne chance !";

    const stopTimes = [1000, 1500, 2000 , 2500 , 3000]; // temps (ms) avant arrêt de chaque rouleau
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
          evaluate(results,Mise);
          if (credits > 0) spinBtn.disabled = false;
        }
      }, stopTimes[index]);
    });
  }
  miseBtn.addEventListener("input",() =>{
    if(miseBtn.value>credits)miseBtn.value=credits;
    if(miseBtn.value<1)miseBtn.value=1;
  });
  spinBtn.addEventListener("click", spin);
  miseBtn.max=credits;
  } ) ();