const KEY = "level-up-v1";

const missions = [
  { id: "soccer", icon: "⚽", name: "Soccer Training", xp: 100 },
  { id: "gym", icon: "🏋️", name: "Gym Workout", xp: 100 },
  { id: "water", icon: "💧", name: "Water Goal", xp: 50 },
  { id: "food", icon: "🍎", name: "Log Food", xp: 50 },
  { id: "study", icon: "🧠", name: "Study Session", xp: 75 }
];

const quotes = [
  ["Everyday a different Motivation quote", "Author"],
  ["Small progress is still progress.", "LEVEL UP"],
  ["Discipline builds the player.", "LEVEL UP"],
  ["Earn your next level.", "LEVEL UP"]
];

const defaultState = {
  name: "Feivel",
  level: 1,
  xp: 0,
  streak: 0,
  skillPoints: 0,
  completed: [],
  date: null
};

let state = load();

function load() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...defaultState };
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function xpNeeded() {
  return 500 + (state.level - 1) * 150;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function resetDay() {
  if (state.date === today()) return;

  if (state.date !== null && state.completed.length === missions.length) {
    state.streak++;
  } else if (state.date !== null) {
    state.streak = 0;
  }

  state.completed = [];
  state.date = today();
  save();
}

function render() {
  document.getElementById("name").textContent = state.name;
  document.getElementById("level").textContent = state.level;
  document.getElementById("xp").textContent = state.xp;
  document.getElementById("xpNeeded").textContent = xpNeeded();
  document.getElementById("streak").textContent = state.streak;

  const percent = Math.min(100, state.xp / xpNeeded() * 100);
  document.getElementById("xpFill").style.width = percent + "%";

  const container = document.getElementById("missions");
  container.innerHTML = "";

  missions.forEach(m => {
    const done = state.completed.includes(m.id);

    const button = document.createElement("button");
    button.className = "mission" + (done ? " done" : "");

    button.innerHTML = `
      <span class="mission-icon">${m.icon}</span>
      <span class="mission-name">${m.name}</span>
      <span class="mission-xp">+${m.xp} XP ${done ? "✓" : ""}</span>
    `;

    button.onclick = () => completeMission(m.id);
    container.appendChild(button);
  });
}

function addXP(amount) {
  state.xp += amount;

  let leveled = false;

  while (state.xp >= xpNeeded()) {
    state.xp -= xpNeeded();
    state.level++;
    state.skillPoints++;
    leveled = true;
  }

  save();
  render();

  if (leveled) showLevelUp();
}

function completeMission(id) {
  if (state.completed.includes(id)) return;

  const mission = missions.find(m => m.id === id);
  if (!mission) return;

  state.completed.push(id);
  addXP(mission.xp);
}

function showLevelUp() {
  document.getElementById("popupLevel").textContent =
    "LEVEL " + state.level;

  document.getElementById("levelUpPopup").classList.add("show");
}

document.getElementById("continueButton").onclick = () => {
  document.getElementById("levelUpPopup").classList.remove("show");
};

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.page;

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });

    document.getElementById(target + "Page").classList.add("active");
    window.scrollTo(0, 0);
  });
});

function rotateQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteText").textContent = quotes[index][0];
  document.getElementById("quoteAuthor").textContent = quotes[index][1];
}

resetDay();
rotateQuote();
render();
