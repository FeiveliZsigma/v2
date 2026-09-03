const STORAGE_KEY = "level-up-v1";

const defaultState = {
  xp: 0,
  level: 1,
  streak: 0,
  skillPoints: 0,
  completed: [],
  lastActiveDate: null
};

const missions = [
  { id: "soccer", icon: "⚽", title: "Soccer training", sub: "Complete today's training session", xp: 100 },
  { id: "workout", icon: "🏋️", title: "Complete workout", sub: "Finish your planned workout", xp: 100 },
  { id: "water", icon: "💧", title: "Hit water goal", sub: "Complete your daily water target", xp: 50 },
  { id: "nutrition", icon: "🍗", title: "Log your meals", sub: "Track what you eat today", xp: 50 },
  { id: "study", icon: "🧠", title: "Study session", sub: "Complete one focused study block", xp: 75 }
];

let state = loadState();

function xpNeeded(level) {
  return 500 + (level - 1) * 150;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultState };
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function resetDailyIfNeeded() {
  const today = todayKey();
  if (state.lastActiveDate !== today) {
    state.completed = [];
    state.lastActiveDate = today;
    saveState();
  }
}

function render() {
  resetDailyIfNeeded();

  const needed = xpNeeded(state.level);
  const percent = Math.min(100, (state.xp / needed) * 100);

  document.querySelector("#level").textContent = state.level;
  document.querySelector("#xpText").textContent = `${state.xp} / ${needed} XP`;
  document.querySelector("#xpFill").style.width = `${percent}%`;
  document.querySelector("#streak").textContent = state.streak;
  document.querySelector("#skillPoints").textContent = state.skillPoints;
  document.querySelector("#completedCount").textContent = state.completed.length;

  document.querySelector("#date").textContent =
    new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  const container = document.querySelector("#missions");
  container.innerHTML = missions.map(m => {
    const done = state.completed.includes(m.id);
    return `
      <button class="mission ${done ? "done" : ""}" data-id="${m.id}">
        <span class="mission-icon">${m.icon}</span>
        <span>
          <span class="mission-title">${m.title}</span>
          <span class="mission-sub">${m.sub}</span>
        </span>
        <span>
          <span class="reward">+${m.xp} XP</span>
          <span class="check">${done ? "✓" : ""}</span>
        </span>
      </button>
    `;
  }).join("");

  document.querySelectorAll(".mission").forEach(button => {
    button.addEventListener("click", () => completeMission(button.dataset.id));
  });
}

function completeMission(id) {
  if (state.completed.includes(id)) return;

  const mission = missions.find(m => m.id === id);
  state.completed.push(id);

  const oldLevel = state.level;
  state.xp += mission.xp;

  while (state.xp >= xpNeeded(state.level)) {
    state.xp -= xpNeeded(state.level);
    state.level++;
    state.skillPoints++;
  }

  if (state.completed.length === missions.length) {
    state.streak++;
  }

  saveState();
  render();

  if (state.level > oldLevel) {
    showLevelUp();
  }
}

function showLevelUp() {
  document.querySelector("#newLevel").textContent = `LEVEL ${state.level}`;
  document.querySelector("#levelupOverlay").classList.add("show");
  document.querySelector("#levelupOverlay").setAttribute("aria-hidden", "false");
}

document.querySelector("#continueBtn").addEventListener("click", () => {
  document.querySelector("#levelupOverlay").classList.remove("show");
  document.querySelector("#levelupOverlay").setAttribute("aria-hidden", "true");
});

render();
