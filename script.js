/* =================================================================
   DESVENDA — Jogo de Adivinhação de Palavras
   
   Banco de dados semântico: cada desafio contém uma palavra-alvo
   e uma lista pré-ordenada de palavras por proximidade semântica.
   Ranking 1 = a palavra secreta. Quanto menor, mais próximo.
   
   SEM números aleatórios. Toda relação é pré-definida.
   ================================================================= */

// ── Banco de desafios com ranking semântico real ──────────────
const CHALLENGES = [
  {
    id: 1,
    secret: "felino",
    hint: "Família de animais ágeis e silenciosos",
    // Map: palavra → ranking (1 = mais próxima = a própria)
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
      "polvo": 78, "estrela-do-mar": 82, "caranguejo": 85, "lagosta": 88,
      "mergulho": 95, "navio": 100, "barco": 105, "vela": 110,
      "navegação": 115, "porto": 120, "farol": 130, "tempestade": 140,
      "tsunami": 150, "sal": 160, "azul": 170, "horizonte": 180,
      "surfar": 200, "nadar": 220, "pescar": 240, "ancora": 260,
      "submarino": 280, "lago": 300, "rio": 320, "cachoeira": 350,
      "chuva": 400, "nuvem": 450, "céu": 500, "terra": 550,
      "montanha": 600, "deserto": 700, "floresta": 750, "campo": 800,
      "cidade": 850, "casa": 900, "estrada": 950, "fogo": 990
    }
  },
  {
    id: 3,
    secret: "melodia",
    hint: "Sequência de sons que encanta os ouvidos",
    words: {
      "melodia": 1, "música": 2, "canção": 3, "harmonia": 4, "ritmo": 5,
      "nota": 8, "tom": 10, "acorde": 12, "compasso": 15, "sinfonia": 18,
      "sonata": 22, "concerto": 25, "ópera": 28, "partitura": 32,
      "instrumento": 38, "piano": 42, "violão": 45, "guitarra": 48,
      "flauta": 52, "violino": 55, "bateria": 60, "saxofone": 65,
      "cantar": 70, "voz": 75, "coro": 80, "banda": 85, "orquestra": 88,
      "compositor": 95, "maestro": 100, "dança": 110, "bailar": 120,
      "palco": 130, "show": 140, "festival": 150, "rádio": 170,
      "ouvir": 180, "som": 190, "barulho": 220, "silêncio": 250,
      "eco": 280, "frequência": 300, "vibração": 320, "onda": 350,
      "orelha": 400, "ouvido": 420, "sensação": 450, "emoção": 480,
      "alegria": 500, "tristeza": 530, "amor": 560, "poesia": 600,
      "arte": 650, "pintura": 700, "cinema": 750, "teatro": 780,
      "livro": 820, "palavra": 860, "número": 900, "pedra": 950
    }
  },
  {
    id: 4,
    secret: "galáxia",
    hint: "Um conjunto gigantesco de estrelas no universo",
    words: {
      "galáxia": 1, "via-láctea": 2, "universo": 3, "cosmos": 4, "nebulosa": 5,
      "constelação": 8, "estrela": 10, "astro": 12, "sol": 15, "supernova": 18,
      "buraco-negro": 22, "quasar": 25, "pulsar": 28, "planeta": 32,
      "saturno": 38, "júpiter": 40, "marte": 42, "lua": 48, "cometa": 52,
      "asteroide": 55, "órbita": 60, "gravidade": 65, "luz": 70,
      "telescópio": 78, "observatório": 82, "astrônomo": 85, "nasa": 90,
      "foguete": 95, "astronauta": 100, "espaço": 105, "infinito": 110,
      "escuro": 120, "vácuo": 130, "matéria": 140, "energia": 150,
      "explosão": 170, "radiação": 180, "poeira": 200, "gás": 220,
      "hidrogênio": 240, "hélio": 260, "fusão": 280, "brilho": 300,
      "noite": 350, "céu": 380, "nuvem": 420, "aurora": 450,
      "horizonte": 500, "mar": 550, "terra": 600, "montanha": 650,
      "rio": 700, "árvore": 750, "animal": 800, "pessoa": 850,
      "casa": 900, "carro": 940, "papel": 970, "sapato": 995
    }
  },
  {
    id: 5,
    secret: "tempestade",
    hint: "Fenômeno da natureza com muita força e barulho",
    words: {
      "tempestade": 1, "temporal": 2, "tormenta": 3, "furacão": 4, "ciclone": 5,
      "tornado": 8, "vendaval": 10, "ventania": 12, "rajada": 15, "trovão": 18,
      "raio": 20, "relâmpago": 22, "chuva": 28, "dilúvio": 32, "enchente": 38,
      "inundação": 42, "granizo": 48, "nuvem": 52, "céu": 58, "escuro": 62,
      "vento": 68, "brisa": 75, "atmosfera": 80, "pressão": 85,
      "meteorologia": 90, "previsão": 95, "clima": 100, "estação": 110,
      "inverno": 120, "frio": 130, "neve": 140, "gelo": 150,
      "guarda-chuva": 160, "abrigo": 170, "destruição": 180, "estrago": 200,
      "medo": 220, "perigo": 240, "alarme": 260, "sirene": 280,
      "mar": 300, "onda": 320, "maré": 340, "oceano": 360,
      "água": 380, "rio": 400, "lago": 430, "seca": 500,
      "deserto": 550, "sol": 600, "calor": 650, "verão": 700,
      "praia": 750, "flor": 800, "jardim": 850, "paz": 900,
      "silêncio": 930, "livro": 960, "mesa": 985
    }
  },
  {
    id: 6,
    secret: "labirinto",
    hint: "Um lugar cheio de caminhos confusos",
    words: {
      "labirinto": 1, "enigma": 3, "mistério": 5, "puzzle": 8, "charada": 10,
      "desafio": 14, "confusão": 18, "caminho": 22, "passagem": 26,
      "corredor": 30, "saída": 35, "entrada": 38, "mapa": 42,
      "bússola": 48, "direção": 52, "perdido": 58, "desorientado": 62,
      "muro": 68, "parede": 72, "barreira": 78, "obstáculo": 82,
      "armadilha": 90, "segredo": 95, "escondido": 100, "oculto": 110,
      "explorar": 120, "aventura": 130, "jornada": 140, "busca": 150,
      "solução": 160, "resposta": 170, "lógica": 180, "raciocínio": 200,
      "pensamento": 220, "mente": 240, "cérebro": 260, "inteligência": 280,
      "jogo": 300, "tabuleiro": 320, "peça": 340, "xadrez": 360,
      "estratégia": 380, "planejamento": 400, "castelo": 440,
      "torre": 480, "calabouço": 500, "dragão": 550, "fantasia": 600,
      "história": 650, "livro": 700, "filme": 750, "teatro": 800,
      "escola": 850, "trabalho": 900, "comida": 950
    }
  },
  {
    id: 7,
    secret: "algoritmo",
    hint: "Uma sequência de passos para resolver problemas",
    words: {
      "algoritmo": 1, "código": 2, "programa": 3, "software": 5, "computação": 8,
      "lógica": 10, "sequência": 12, "instrução": 15, "função": 18,
      "variável": 22, "loop": 25, "condição": 28, "dados": 32,
      "processamento": 38, "binário": 42, "bit": 45, "byte": 48,
      "memória": 52, "processador": 55, "computador": 60, "máquina": 65,
      "inteligência-artificial": 70, "automação": 75, "robô": 80,
      "programador": 85, "desenvolvedor": 88, "hacker": 92,
      "internet": 100, "rede": 110, "servidor": 120, "banco-de-dados": 130,
      "nuvem": 140, "aplicativo": 150, "sistema": 160, "tecnologia": 170,
      "inovação": 200, "ciência": 220, "matemática": 240, "cálculo": 260,
      "número": 280, "equação": 300, "fórmula": 320, "problema": 340,
      "solução": 360, "método": 380, "passo": 400, "receita": 450,
      "mapa": 500, "manual": 550, "livro": 600, "escola": 650,
      "professor": 700, "aluno": 750, "caderno": 800, "caneta": 850,
      "mesa": 900, "cadeira": 950, "janela": 990
    }
  }
];

// ── Estado do jogo ───────────────────────────────────────────
let gameState = {
  challengeIndex: 0,
  guesses: [],           // [{word, rank}]
  isOver: false,
  isWon: false,
  hintUsed: false,
  hintRevealed: false,
  startTime: null,
  dailyMode: true
};

// ── Utilidades ───────────────────────────────────────────────

/** Normaliza texto: lowercase, sem acentos, sem espaços extras */
function normalize(str) {
  return str.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/** Retorna o desafio do dia baseado na data */
function getDailyChallenge() {
  const today = new Date();
  const start = new Date(2026, 0, 1);
  const diff  = Math.floor((today - start) / 86400000);
  const index = diff % CHALLENGES.length;
  return { challenge: CHALLENGES[index], dayNumber: diff + 1 };
}

/** Busca o ranking de uma palavra no desafio atual */
function getRanking(word, challenge) {
  const norm = normalize(word);
  // Procura match direto (normalizado)
  for (const [w, rank] of Object.entries(challenge.words)) {
    if (normalize(w) === norm) return rank;
  }
  // Se não está na lista, calcular distância baseada em heurísticas
  return calculateFallbackRank(norm, challenge);
}

/** Heurística para palavras não catalogadas */
function calculateFallbackRank(word, challenge) {
  const secret = normalize(challenge.secret);

  // Mesma palavra = acerto
  if (word === secret) return 1;

  // Verifica se compartilha prefixo com a palavra secreta
  let commonPrefix = 0;
  for (let i = 0; i < Math.min(word.length, secret.length); i++) {
    if (word[i] === secret[i]) commonPrefix++;
    else break;
  }

  // Conta letras em comum
  const secretLetters = new Set(secret.split(""));
  const wordLetters   = new Set(word.split(""));
  let commonLetters = 0;
  for (const l of wordLetters) {
    if (secretLetters.has(l)) commonLetters++;
  }

  // Similiaridade de comprimento
  const lenDiff = Math.abs(word.length - secret.length);

  // Verifica se contém substring do segredo
  let substringBonus = 0;
  for (let len = 3; len <= secret.length; len++) {
    for (let i = 0; i <= secret.length - len; i++) {
      if (word.includes(secret.substring(i, i + len))) {
        substringBonus = Math.max(substringBonus, len * 15);
      }
    }
  }

  // Gera ranking base (500-999 para palavras desconhecidas)
  let base = 700;
  base -= commonPrefix * 40;
  base -= commonLetters * 20;
  base -= substringBonus;
  base += lenDiff * 10;

  // Clamp entre 200 e 999
  return Math.max(200, Math.min(999, Math.round(base)));
}

/** Determina a classe de ranking (para cor) */
function getRankClass(rank) {
  if (rank <= 10)  return "rank-hot";
  if (rank <= 50)  return "rank-warm";
  if (rank <= 200) return "rank-cool";
  if (rank <= 500) return "rank-cold";
  return "rank-frozen";
}

/** Determina a largura da barra de ranking (%) */
function getRankBarWidth(rank) {
  // Inversamente proporcional: rank 1 = 100%, rank 1000 = 2%
  return Math.max(2, Math.round(100 - (rank / 10)));
}

/** Emoji de ranking */
function getRankEmoji(rank) {
  if (rank === 1)  return "🎯";
  if (rank <= 10)  return "🔥";
  if (rank <= 50)  return "☀️";
  if (rank <= 200) return "🌤️";
  if (rank <= 500) return "❄️";
  return "🥶";
}

// ── LocalStorage Seguro ──────────────────────────────────────
const STORAGE_KEYS = {
  stats: "desvenda_stats",
  history: "desvenda_history",
  current: "desvenda_current",
  theme: "desvenda_theme",
  sound: "desvenda_sound"
};

function safeGetItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`[DESVENDA] Falha ao recuperar chave "${key}":`, e);
    return defaultValue;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch (e) {
    console.warn(`[DESVENDA] Falha ao gravar chave "${key}":`, e);
  }
}

function loadStats() {
  const stats = safeGetItem(STORAGE_KEYS.stats);
  return stats || {
    gamesPlayed: 0,
    gamesWon: 0,
    totalGuesses: 0,
    bestResult: null, // menor nº de tentativas
    currentStreak: 0,
    bestStreak: 0
  };
}

function saveStats(stats) {
  safeSetItem(STORAGE_KEYS.stats, stats);
}

function loadHistory() {
  const history = safeGetItem(STORAGE_KEYS.history);
  return Array.isArray(history) ? history : [];
}

function saveHistory(history) {
  // Manter apenas as últimas 20 partidas
  const trimmed = history.slice(-20);
  safeSetItem(STORAGE_KEYS.history, trimmed);
}

function loadCurrentGame() {
  return safeGetItem(STORAGE_KEYS.current, null);
}

function saveCurrentGame() {
  const { challenge, dayNumber } = getDailyChallenge();
  const data = {
    dayNumber,
    challengeId: challenge.id,
    guesses: gameState.guesses,
    isOver: gameState.isOver,
    isWon: gameState.isWon,
    hintUsed: gameState.hintUsed,
    hintRevealed: gameState.hintRevealed
  };
  safeSetItem(STORAGE_KEYS.current, data);
}

function clearCurrentGame() {
  try {
    localStorage.removeItem(STORAGE_KEYS.current);
  } catch (e) {}
}

// ── Sistema de Som & Microinterações (Web Audio API) ─────────
let soundEnabled = true;

function loadSoundPref() {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.sound);
    return val !== null ? val === "true" : true;
  } catch (e) {
    return true;
  }
}

function setSoundPref(enabled) {
  soundEnabled = enabled;
  try {
    localStorage.setItem(STORAGE_KEYS.sound, enabled);
  } catch (e) {}
  updateSoundIcon();
}

function toggleSound() {
  setSoundPref(!soundEnabled);
  showToast(soundEnabled ? "Efeitos sonoros ativados 🔊" : "Efeitos sonoros silenciados 🔇", "info");
  if (soundEnabled) playTone(520, "sine", 0.1);
}

function updateSoundIcon() {
  const btn = document.getElementById("soundToggle");
  if (!btn) return;
  btn.innerHTML = soundEnabled
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
}

function playTone(freq, type = "sine", duration = 0.15) {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playWinSound() {
  if (!soundEnabled) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    setTimeout(() => playTone(freq, "triangle", 0.3), idx * 120);
  });
}

// ── Tema (dark/light) ────────────────────────────────────────
function loadTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  } catch (e) {
    return "dark";
  }
}

function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch (e) {}
  document.documentElement.classList.remove("dark", "light");
  if (theme === "light") {
    document.documentElement.classList.add("light");
  }
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = loadTheme();
  setTheme(current === "dark" ? "light" : "dark");
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.innerHTML = theme === "dark"
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ── Motor do jogo ────────────────────────────────────────────

function initGame() {
  const { challenge, dayNumber } = getDailyChallenge();
  gameState.challengeIndex = CHALLENGES.findIndex(c => c.id === challenge.id);

  // Tenta restaurar jogo em andamento
  const saved = loadCurrentGame();
  if (saved && saved.dayNumber === dayNumber && saved.challengeId === challenge.id) {
    gameState.guesses = saved.guesses || [];
    gameState.isOver = saved.isOver || false;
    gameState.isWon = saved.isWon || false;
    gameState.hintUsed = saved.hintUsed || false;
    gameState.hintRevealed = saved.hintRevealed || false;
  } else {
    gameState.guesses = [];
    gameState.isOver = false;
    gameState.isWon = false;
    gameState.hintUsed = false;
    gameState.hintRevealed = false;
  }

  gameState.startTime = Date.now();
  renderAll(challenge, dayNumber);
}

function getCurrentChallenge() {
  return getDailyChallenge().challenge;
}

function submitGuess() {
  if (gameState.isOver) return;

  const input = document.getElementById("guessInput");
  const word = input.value.trim();

  if (!word) {
    showToast("Digite uma palavra!", "error");
    shakeInput();
    playTone(180, "sawtooth", 0.15);
    return;
  }

  // Validação: apenas letras, acentos, hífens e espaços
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(word)) {
    showToast("Digite apenas letras (sem números ou símbolos)!", "error");
    shakeInput();
    playTone(160, "sawtooth", 0.2);
    return;
  }

  const normalizedWord = normalize(word);
  const displayWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  // Verifica duplicatas
  if (gameState.guesses.some(g => normalize(g.word) === normalizedWord)) {
    showToast("Você já tentou essa palavra!", "error");
    shakeInput();
    playTone(200, "sawtooth", 0.15);
    input.value = "";
    return;
  }

  const challenge = getCurrentChallenge();
  const rank = getRanking(normalizedWord, challenge);

  const guess = { word: displayWord, rank };
  gameState.guesses.push(guess);

  // Ordena por ranking (mais próximos primeiro)
  gameState.guesses.sort((a, b) => a.rank - b.rank);

  input.value = "";
  input.focus();

  // Verifica vitória
  if (rank === 1) {
    gameState.isOver = true;
    gameState.isWon = true;
    playWinSound();
    onGameEnd(true);
  } else {
    // Efeito sonoro dinâmico proporcional à proximidade
    const dynamicFreq = 300 + Math.max(0, Math.floor((1000 - rank) * 0.45));
    playTone(dynamicFreq, "sine", 0.12);
  }

  saveCurrentGame();
  renderGuessList();
  updateGuessCounter();
}

function onGameEnd(won) {
  const stats = loadStats();
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    if (!stats.bestResult || gameState.guesses.length < stats.bestResult) {
      stats.bestResult = gameState.guesses.length;
    }
  } else {
    stats.currentStreak = 0;
  }
  stats.totalGuesses += gameState.guesses.length;
  saveStats(stats);

  // Salva no histórico
  const history = loadHistory();
  const { dayNumber } = getDailyChallenge();
  history.push({
    dayNumber,
    date: new Date().toISOString().slice(0, 10),
    won,
    guesses: gameState.guesses.length,
    secret: getCurrentChallenge().secret,
    hintUsed: gameState.hintUsed
  });
  saveHistory(history);
  saveCurrentGame();

  if (won) {
    setTimeout(() => showVictoryModal(), 600);
    launchConfetti();
  }
}

function giveUp() {
  if (gameState.isOver) return;
  gameState.isOver = true;
  gameState.isWon = false;
  const challenge = getCurrentChallenge();

  onGameEnd(false);

  // Adiciona a palavra secreta à lista
  const secretDisplay = challenge.secret.charAt(0).toUpperCase() + challenge.secret.slice(1);
  if (!gameState.guesses.some(g => g.rank === 1)) {
    gameState.guesses.unshift({ word: secretDisplay, rank: 1 });
  }

  renderGuessList();
  updateGuessCounter();
  disableInput();
  showToast(`A palavra era: ${secretDisplay}`, "info");
}

function showHint() {
  if (gameState.hintRevealed) return;
  const challenge = getCurrentChallenge();
  gameState.hintUsed = true;
  gameState.hintRevealed = true;
  saveCurrentGame();

  const hintArea = document.getElementById("hintArea");
  hintArea.innerHTML = `<div class="hint-box">💡 ${challenge.hint}</div>`;
}

function newGame() {
  // Avança para um desafio aleatório (modo livre)
  gameState.dailyMode = false;
  const usedIds = loadHistory().map(h => h.dayNumber);
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * CHALLENGES.length);
  } while (CHALLENGES[newIndex].id === getCurrentChallenge().id && CHALLENGES.length > 1);

  gameState.challengeIndex = newIndex;
  gameState.guesses = [];
  gameState.isOver = false;
  gameState.isWon = false;
  gameState.hintUsed = false;
  gameState.hintRevealed = false;
  gameState.startTime = Date.now();

  clearCurrentGame();
  const challenge = CHALLENGES[newIndex];
  renderAll(challenge, `Livre #${newIndex + 1}`);
  enableInput();
}

// ── Renderização ─────────────────────────────────────────────

function renderAll(challenge, dayLabel) {
  document.getElementById("dayNumber").textContent =
    typeof dayLabel === "number" ? `Desafio #${dayLabel}` : dayLabel;
  renderGuessList();
  updateGuessCounter();

  const hintArea = document.getElementById("hintArea");
  if (gameState.hintRevealed) {
    hintArea.innerHTML = `<div class="hint-box">💡 ${challenge.hint}</div>`;
  } else {
    hintArea.innerHTML = "";
  }

  if (gameState.isOver) {
    disableInput();
  } else {
    enableInput();
  }
}

function renderGuessList() {
  const list = document.getElementById("guessList");
  const empty = document.getElementById("emptyState");

  if (gameState.guesses.length === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  list.innerHTML = gameState.guesses.map((g, i) => {
    const rankClass = getRankClass(g.rank);
    const barWidth = getRankBarWidth(g.rank);
    const emoji = getRankEmoji(g.rank);
    const isWinning = g.rank === 1;
    const extraClass = isWinning ? "victory-glow" : "";

    return `
      <div class="guess-row ${rankClass} ${extraClass}" style="animation-delay: ${i * 0.05}s">
        <div class="flex items-center gap-2">
          <span style="font-size:1.1rem">${emoji}</span>
          <span class="guess-word">${g.word}</span>
        </div>
        <div class="flex items-center gap-3" style="min-width: 140px; justify-content: flex-end;">
          <div style="width: 60px; background: var(--secondary); border-radius: 2px; overflow: hidden;">
            <div class="rank-bar" style="width: ${barWidth}%; background: currentColor;"></div>
          </div>
          <span class="guess-rank">#${g.rank}</span>
        </div>
      </div>
    `;
  }).join("");
}

function updateGuessCounter() {
  document.getElementById("guessCount").textContent = gameState.guesses.length;
}

function disableInput() {
  const input = document.getElementById("guessInput");
  const btn = document.getElementById("submitBtn");
  input.disabled = true;
  btn.disabled = true;
  input.placeholder = gameState.isWon ? "🎉 Parabéns! Você acertou!" : "Jogo encerrado";
}

function enableInput() {
  const input = document.getElementById("guessInput");
  const btn = document.getElementById("submitBtn");
  input.disabled = false;
  btn.disabled = false;
  input.placeholder = "Digite uma palavra...";
  input.focus();
}

function shakeInput() {
  const input = document.getElementById("guessInput");
  input.classList.add("animate-shake");
  setTimeout(() => input.classList.remove("animate-shake"), 400);
}

// ── Toast ────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.className = `toast toast-${type} show`;
  toast.textContent = message;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ── Confetti ─────────────────────────────────────────────────
function launchConfetti() {
  const container = document.getElementById("confetti");
  container.innerHTML = "";
  const colors = [
    "var(--primary)", "var(--accent)", "var(--success)",
    "var(--warning)", "hsl(300 70% 60%)", "hsl(180 70% 50%)"
  ];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    const x = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 1.5 + Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 6;
    const rotation = Math.random() * 360;

    piece.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: -10px;
      width: ${size}px;
      height: ${size * 0.6}px;
      background: ${color};
      border-radius: 2px;
      transform: rotate(${rotation}deg);
      animation: confettiFall ${duration}s ease-in ${delay}s forwards;
    `;
    container.appendChild(piece);
  }

  // Remove after animation
  setTimeout(() => { container.innerHTML = ""; }, 4000);
}

// Add confetti keyframes dynamically
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`;
document.head.appendChild(confettiStyle);

// ── Modais ───────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function showRulesModal() {
  openModal("rulesModal");
}

function showStatsModal() {
  const stats = loadStats();
  const avgGuesses = stats.gamesPlayed > 0
    ? (stats.totalGuesses / stats.gamesPlayed).toFixed(1)
    : "—";
  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  document.getElementById("statsContent").innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.gamesPlayed}</div>
        <div class="stat-label">Partidas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${winRate}%</div>
        <div class="stat-label">Vitórias</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgGuesses}</div>
        <div class="stat-label">Média de tentativas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.bestResult || "—"}</div>
        <div class="stat-label">Melhor resultado</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.currentStreak}</div>
        <div class="stat-label">Sequência atual</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.bestStreak}</div>
        <div class="stat-label">Melhor sequência</div>
      </div>
    </div>
  `;

  // Histórico
  const history = loadHistory().slice(-10).reverse();
  let historyHTML = "";
  if (history.length === 0) {
    historyHTML = '<p class="text-muted text-sm text-center mt-4">Nenhuma partida registrada.</p>';
  } else {
    historyHTML = `
      <div class="mt-4">
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Últimas partidas</h3>
        ${history.map(h => `
          <div class="guess-row" style="margin-bottom: 0.3rem; border-left-color: ${h.won ? 'var(--success)' : 'var(--destructive)'};">
            <div>
              <span style="font-weight: 500;">${h.won ? '✅' : '❌'} ${h.secret}</span>
              <span class="text-muted text-xs" style="margin-left: 0.5rem;">${h.date}</span>
            </div>
            <span class="text-sm ${h.won ? '' : 'text-muted'}">${h.won ? h.guesses + ' tentativas' : 'Desistiu'}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  document.getElementById("historyContent").innerHTML = historyHTML;
  openModal("statsModal");
}

function showVictoryModal() {
  const count = gameState.guesses.length;
  const challenge = getCurrentChallenge();
  const secretDisplay = challenge.secret.charAt(0).toUpperCase() + challenge.secret.slice(1);

  let message;
  if (count <= 3) message = "Incrível! Você é um gênio! 🧠";
  else if (count <= 8) message = "Muito bem! Excelente desempenho! ⭐";
  else if (count <= 15) message = "Boa! Você encontrou! 👏";
  else message = "Conseguiu! A persistência valeu a pena! 💪";

  document.getElementById("victoryContent").innerHTML = `
    <div class="text-center">
      <div style="font-size: 4rem; margin-bottom: 1rem;" class="animate-bounce-in">🏆</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem;">Parabéns!</h2>
      <p class="text-muted" style="margin-bottom: 1.5rem;">${message}</p>
      <div class="game-card" style="margin-bottom: 1.5rem;">
        <p class="text-sm text-muted">A palavra era</p>
        <p class="logo-text" style="font-size: 1.8rem; margin: 0.5rem 0;">${secretDisplay}</p>
        <div class="separator"></div>
        <div class="flex justify-between">
          <div class="text-center" style="flex: 1;">
            <div style="font-size: 1.4rem; font-weight: 700;">${count}</div>
            <div class="text-xs text-muted">tentativas</div>
          </div>
          <div class="text-center" style="flex: 1;">
            <div style="font-size: 1.4rem; font-weight: 700;">${gameState.hintUsed ? "Sim" : "Não"}</div>
            <div class="text-xs text-muted">usou dica</div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary w-full" onclick="closeModal('victoryModal'); newGame();">
        🎮 Novo desafio
      </button>
    </div>
  `;
  openModal("victoryModal");
}

// ── Inicialização ────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Aplica tema salvo
  setTheme(loadTheme());

  // Aplica preferência de som salva
  setSoundPref(loadSoundPref());

  // Inicia jogo
  initGame();

  // Event listeners
  document.getElementById("guessInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitGuess();
  });

  // Fechar modais ao clicar fora
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });

  // Fechar modais com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(m => {
        m.classList.remove("active");
      });
    }
  });
});
