(function () {
  const moves = ["rock", "paper", "scissors"];
  const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };
  const RULES = { rock: "scissors", paper: "rock", scissors: "paper" };
  const REASONS = {
    rock: { scissors: "Rock crushes Scissors" },
    paper: { rock: "Paper covers Rock" },
    scissors: { paper: "Scissors cut Paper" },
  };

  // Toggle this to mute/unmute win sound
  const SOUND_ON = true;

  const els = {
    playerScore: document.getElementById("playerScore"),
    cpuScore: document.getElementById("cpuScore"),
    headline: document.getElementById("headline"),
    detail: document.getElementById("detail"),
    youMove: document.getElementById("youMove"),
    cpuMove: document.getElementById("cpuMove"),
    themeBtn: document.getElementById("themeBtn"),
    resetBtn: document.getElementById("resetBtn"),
    againBtn: document.getElementById("againBtn"),
    youPanel: document.getElementById("youPanel"),
    cpuPanel: document.getElementById("cpuPanel"),
    choiceButtons: Array.from(document.querySelectorAll(".choice-btn")),
    winModal: document.getElementById("winModal"),
    winReason: document.getElementById("winReason"),
    nextRoundBtn: document.getElementById("nextRoundBtn"),
    confetti: document.querySelector("#winModal .confetti"),
  };

  const themes = [
    { cls: "theme-neon", label: "Neon" },
    { cls: "theme-glass", label: "Glass" },
    { cls: "theme-sunset", label: "Sunset" },
  ];
  let themeIndex = 0;

  let score = { player: 0, cpu: 0 };
  let lastOutcome = null;

  // Init theme from storage
  const savedTheme = localStorage.getItem("rps-theme");
  if (savedTheme) {
    const found = themes.findIndex((t) => t.cls === savedTheme);
    themeIndex = found >= 0 ? found : 0;
  }
  setTheme(themeIndex);

  function setTheme(idx) {
    const root = document.body;
    themes.forEach((t) => root.classList.remove(t.cls));
    root.classList.add(themes[idx].cls);
    els.themeBtn.textContent = `🎨 Theme: ${themes[idx].label}`;
    localStorage.setItem("rps-theme", themes[idx].cls);
  }

  els.themeBtn.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % themes.length;
    setTheme(themeIndex);
  });

  // Game logic
  function cpuPick() {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function decide(player, cpu) {
    if (player === cpu) return "draw";
    return RULES[player] === cpu ? "win" : "lose";
  }

  function updateScores(outcome) {
    if (outcome === "win") score.player++;
    if (outcome === "lose") score.cpu++;
    els.playerScore.textContent = score.player;
    els.cpuScore.textContent = score.cpu;
  }

  function setPanels(outcome) {
    [els.youPanel, els.cpuPanel].forEach((p) => {
      p.classList.remove("win", "lose");
    });
    if (outcome === "win") {
      els.youPanel.classList.add("win");
      els.cpuPanel.classList.add("lose");
    } else if (outcome === "lose") {
      els.cpuPanel.classList.add("win");
      els.youPanel.classList.add("lose");
    }
  }

  function showResult(outcome, player, cpu) {
    const reason =
      outcome === "draw"
        ? "It's a draw."
        : outcome === "win"
        ? REASONS[player][cpu]
        : REASONS[cpu][player];

    els.headline.className = `headline ${outcome}`;
    els.headline.textContent =
      outcome === "draw"
        ? "Draw!"
        : outcome === "win"
        ? "You win!"
        : "You lose!";
    els.detail.textContent = `${capitalize(player)} ${
      EMOJI[player]
    } vs ${capitalize(cpu)} ${EMOJI[cpu]} — ${reason}`;

    els.youMove.textContent = `${EMOJI[player]} ${capitalize(player)}`;
    els.cpuMove.textContent = `${EMOJI[cpu]} ${capitalize(cpu)}`;
    return reason;
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function ripple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.1;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${
      (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2
    }px`;
    span.style.top = `${
      (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2
    }px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove(), { once: true });
  }

  function playRound(playerMove) {
    const cpu = cpuPick();
    const outcome = decide(playerMove, cpu);
    lastOutcome = outcome;

    updateScores(outcome);
    setPanels(outcome);
    const reason = showResult(outcome, playerMove, cpu);

    if (outcome === "win") {
      openWinModal(reason);
      if (SOUND_ON) playWinJingle();
    }
  }

  // Wire buttons
  els.choiceButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      ripple(e);
      playRound(btn.dataset.move);
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "r") playRound("rock");
    if (k === "p") playRound("paper");
    if (k === "s") playRound("scissors");
    if (k === "escape" && els.winModal.classList.contains("show"))
      closeWinModal();
  });

  // Reset and Again
  function resetAll() {
    score.player = 0;
    score.cpu = 0;
    els.playerScore.textContent = "0";
    els.cpuScore.textContent = "0";
    els.headline.className = "headline";
    els.headline.textContent = "Make your move.";
    els.detail.textContent = "Tip: press R, P, or S on your keyboard.";
    els.youMove.textContent = "—";
    els.cpuMove.textContent = "—";
    [els.youPanel, els.cpuPanel].forEach((p) =>
      p.classList.remove("win", "lose")
    );
  }
  els.resetBtn.addEventListener("click", resetAll);
  els.againBtn.addEventListener("click", () => {
    const ring = document.querySelector(".vs .ring");
    ring.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.06)" },
        { transform: "scale(1)" },
      ],
      { duration: 260, easing: "ease-out" }
    );
    if (lastOutcome === "draw") {
      els.headline.className = "headline";
    }
  });

  // Win Modal controls
  function openWinModal(reason) {
    els.winReason.textContent = reason;
    els.winModal.classList.add("show");
    els.winModal.removeAttribute("hidden");
    els.nextRoundBtn.focus({ preventScroll: true });
    spawnConfetti(els.confetti, 36);
  }
  function closeWinModal() {
    els.winModal.classList.remove("show");
    // clean confetti
    els.confetti.innerHTML = "";
    // hide after a tick (in case of future transitions)
    setTimeout(() => els.winModal.setAttribute("hidden", ""), 0);
  }
  els.nextRoundBtn.addEventListener("click", () => {
    closeWinModal();
    const ring = document.querySelector(".vs .ring");
    ring.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.06)" },
        { transform: "scale(1)" },
      ],
      { duration: 260, easing: "ease-out" }
    );
  });
  els.winModal.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-close")) closeWinModal();
  });

  function spawnConfetti(container, count = 36) {
    if (!container) return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const styles = getComputedStyle(document.body);
    const colors = [
      styles.getPropertyValue("--primary").trim() || "#00f0ff",
      styles.getPropertyValue("--accent").trim() || "#ff00d4",
      styles.getPropertyValue("--win").trim() || "#4df3a1",
    ];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "piece";
      const size = 6 + Math.random() * 7;
      p.style.width = `${size}px`;
      p.style.height = `${size * 1.4}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = colors[i % colors.length];
      p.style.transform = `translateY(-20px) rotate(${Math.random() * 180}deg)`;
      p.style.animationDuration = `${0.9 + Math.random() * 1.1}s`;
      p.style.animationDelay = `${Math.random() * 0.2}s`;
      frag.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
    container.appendChild(frag);
  }

  // Win sound using Web Audio (runs only on user action)
  let audioCtx = null;
  function playWinJingle() {
    try {
      audioCtx =
        audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime + 0.02;
      const seq = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      seq.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        const t = now + i * 0.12;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch (e) {
      // ignore if audio blocked
    }
  }

  // Progressive enhancement marker
  document.documentElement.classList.remove("no-js");
})();
