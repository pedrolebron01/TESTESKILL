/* =================================================================
   DESVENDA — Lógica do Jogo (Versão SEM a Skill)
   
   Sem a arquitetura de tokens da skill:
   - Cores e classes do Tailwind são montadas por concatenação de strings com cores fixas:
     'text-green-400 bg-green-500/10 border-l-4 border-green-500'
   - Se precisarmos mudar as cores do projeto ou adicionar temas, teríamos que
     alterar strings manualmente dentro do JavaScript!
   ================================================================= */

const CHALLENGES = [
  {
    id: 1,
    secret: "felino",
    hint: "Família de animais ágeis e silenciosos",
    words: {
      "felino": 1, "gato": 2, "tigre": 3, "leopardo": 4, "pantera": 5,
      "lince": 6, "onça": 7, "jaguar": 8, "leão": 10, "puma": 11,
      "guepardo": 12, "jaguatirica": 14, "gatinho": 16, "miau": 20,
      "bigode": 25, "garras": 28, "peludo": 32, "caça": 38, "predador": 42,
      "selvagem": 50, "animal": 55, "mamífero": 60, "bicho": 68,
      "floresta": 80, "natureza": 90, "safari": 100, "savana": 110,
      "zoológico": 120, "jaula": 130, "corrida": 150, "velocidade": 160,
      "noturno": 170, "furtivo": 180, "domesticar": 200, "ração": 220,
      "veterinário": 240, "estimação": 260, "cachorro": 300, "pássaro": 350,
      "peixe": 400, "cobra": 420, "tartaruga": 450, "elefante": 480,
      "girafa": 500, "macaco": 520, "cavalo": 550, "vaca": 580,
      "porco": 600, "galinha": 650, "rato": 680, "inseto": 700,
      "planta": 750, "pedra": 800, "carro": 850, "mesa": 900,
      "computador": 950, "telefone": 980, "livro": 990, "sol": 995
    }
  },
  {
    id: 2,
    secret: "oceano",
    hint: "Uma imensa extensão azul que cobre o planeta",
    words: {
      "oceano": 1, "mar": 2, "atlântico": 3, "pacífico": 4, "índico": 5,
      "água": 8, "onda": 10, "maré": 12, "corrente": 15, "profundidade": 18,
      "abismo": 22, "fundo": 25, "praia": 30, "costa": 35, "litoral": 38,
      "areia": 42, "concha": 48, "coral": 52, "recife": 55, "alga": 60,
      "peixe": 65, "baleia": 68, "tubarão": 70, "golfinho": 72,
      "mergulho": 95, "navio": 100, "barco": 105, "tsunami": 150,
      "sal": 160, "azul": 170, "horizonte": 180, "nadar": 220,
      "lago": 300, "rio": 320, "chuva": 400, "terra": 550, "casa": 900
    }
  }
];

let gameState = {
  guesses: [],
  isOver: false,
  isWon: false,
  hintUsed: false,
  hintRevealed: false
};

function normalize(str) {
  return str.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function getDailyChallenge() {
  const today = new Date();
  const start = new Date(2026, 0, 1);
  const diff = Math.floor((today - start) / 86400000);
  const index = diff % CHALLENGES.length;
  return { challenge: CHALLENGES[index], dayNumber: diff + 1 };
}

function getRanking(word, challenge) {
  const norm = normalize(word);
  for (const [w, rank] of Object.entries(challenge.words)) {
    if (normalize(w) === norm) return rank;
  }
  const secret = normalize(challenge.secret);
  if (norm === secret) return 1;
  let score = 750;
  for (let i = 0; i < Math.min(norm.length, secret.length); i++) {
    if (norm[i] === secret[i]) score -= 30;
  }
  return Math.max(150, Math.min(999, score));
}

// Sem a skill: classes de estilo são hardcoded diretamente em strings com cores Tailwind v3/v4 fixas!
function getRankStyle(rank) {
  if (rank <= 10) {
    return {
      classes: "bg-emerald-950/30 text-emerald-400 border-l-4 border-emerald-500",
      barBg: "bg-emerald-500",
      emoji: "🔥"
    };
  }
  if (rank <= 50) {
    return {
      classes: "bg-lime-950/30 text-lime-400 border-l-4 border-lime-500",
      barBg: "bg-lime-500",
      emoji: "☀️"
    };
  }
  if (rank <= 200) {
    return {
      classes: "bg-amber-950/30 text-amber-400 border-l-4 border-amber-500",
      barBg: "bg-amber-500",
      emoji: "🌤️"
    };
  }
  if (rank <= 500) {
    return {
      classes: "bg-orange-950/30 text-orange-400 border-l-4 border-orange-500",
      barBg: "bg-orange-500",
      emoji: "❄️"
    };
  }
  return {
    classes: "bg-rose-950/30 text-rose-400 border-l-4 border-rose-500",
    barBg: "bg-rose-500",
    emoji: "🥶"
  };
}

function submitGuess() {
  if (gameState.isOver) return;
  const input = document.getElementById("guessInput");
  const word = input.value.trim();

  if (!word) {
    showToast("Digite uma palavra!", "bg-rose-600 text-white");
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 300);
    return;
  }

  const norm = normalize(word);
  if (gameState.guesses.some(g => normalize(g.word) === norm)) {
    showToast("Palavra já tentada!", "bg-rose-600 text-white");
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 300);
    input.value = "";
    return;
  }

  const { challenge } = getDailyChallenge();
  const rank = getRanking(norm, challenge);
  const display = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  gameState.guesses.push({ word: display, rank });
  gameState.guesses.sort((a, b) => a.rank - b.rank);

  input.value = "";
  input.focus();

  if (rank === 1) {
    gameState.isOver = true;
    gameState.isWon = true;
    saveStats(true);
    setTimeout(() => openModal("victoryModal"), 400);
  }

  renderGuesses();
}

function renderGuesses() {
  const list = document.getElementById("guessList");
  const empty = document.getElementById("emptyState");
  document.getElementById("guessCount").textContent = gameState.guesses.length;

  if (gameState.guesses.length === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  list.innerHTML = gameState.guesses.map(g => {
    const style = getRankStyle(g.rank);
    const pct = Math.max(4, Math.round(100 - (g.rank / 10)));
    return `
      <div class="flex items-center justify-between p-3 rounded-lg ${style.classes} transition-all">
        <div class="flex items-center space-x-2">
          <span>${style.emoji}</span>
          <span class="font-semibold text-slate-100">${g.word}</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="${style.barBg} h-full" style="width: ${pct}%"></div>
          </div>
          <span class="font-bold text-sm">#${g.rank}</span>
        </div>
      </div>
    `;
  }).join("");
}

function showHint() {
  if (gameState.hintRevealed) return;
  const { challenge } = getDailyChallenge();
  gameState.hintUsed = true;
  gameState.hintRevealed = true;
  document.getElementById("hintArea").innerHTML = `
    <div class="bg-blue-900/40 border border-blue-500/40 text-blue-200 p-3 rounded-lg text-sm mt-3">
      💡 Pista: ${challenge.hint}
    </div>
  `;
}

function giveUp() {
  if (gameState.isOver) return;
  if (!confirm("Tem certeza que deseja desistir?")) return;
  const { challenge } = getDailyChallenge();
  gameState.isOver = true;
  saveStats(false);

  const secretDisplay = challenge.secret.charAt(0).toUpperCase() + challenge.secret.slice(1);
  if (!gameState.guesses.some(g => g.rank === 1)) {
    gameState.guesses.unshift({ word: secretDisplay, rank: 1 });
  }
  renderGuesses();
  showToast(`A resposta era: ${secretDisplay}`, "bg-blue-600 text-white");
  document.getElementById("guessInput").disabled = true;
  document.getElementById("submitBtn").disabled = true;
}

function newGame() {
  gameState.guesses = [];
  gameState.isOver = false;
  gameState.isWon = false;
  gameState.hintUsed = false;
  gameState.hintRevealed = false;
  document.getElementById("hintArea").innerHTML = "";
  document.getElementById("guessInput").disabled = false;
  document.getElementById("submitBtn").disabled = false;
  document.getElementById("guessInput").value = "";
  renderGuesses();
}

function showToast(msg, bgClass = "bg-slate-800 text-white") {
  const toast = document.getElementById("toast");
  toast.className = `toast-msg show ${bgClass}`;
  toast.textContent = msg;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function saveStats(won) {
  const raw = localStorage.getItem("desvenda_semskill_stats");
  const stats = raw ? JSON.parse(raw) : { played: 0, won: 0, attempts: 0 };
  stats.played++;
  if (won) stats.won++;
  stats.attempts += gameState.guesses.length;
  localStorage.setItem("desvenda_semskill_stats", JSON.stringify(stats));
}

function showStatsModal() {
  const raw = localStorage.getItem("desvenda_semskill_stats");
  const stats = raw ? JSON.parse(raw) : { played: 0, won: 0, attempts: 0 };
  document.getElementById("statsContent").innerHTML = `
    <div class="grid grid-cols-2 gap-3 text-center">
      <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <div class="text-2xl font-bold text-purple-400">${stats.played}</div>
        <div class="text-xs text-slate-400 mt-1">Partidas</div>
      </div>
      <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
        <div class="text-2xl font-bold text-purple-400">${stats.won}</div>
        <div class="text-xs text-slate-400 mt-1">Vitórias</div>
      </div>
    </div>
  `;
  openModal("statsModal");
}

document.addEventListener("DOMContentLoaded", () => {
  const { dayNumber } = getDailyChallenge();
  document.getElementById("dayBadge").textContent = `Desafio #${dayNumber}`;
  document.getElementById("guessInput").addEventListener("keydown", e => {
    if (e.key === "Enter") submitGuess();
  });
});
