/* =========================================
   PROFILE
========================================= */

function loadProfile() {
  const user = getUser();

  /* =====================================
       USERNAME
    ===================================== */

  const username = document.getElementById("username");

  username.textContent = user.username || "کاربر";

  /* =====================================
       XP
    ===================================== */

  const userXP = document.getElementById("userXP");

  userXP.textContent = user.xp;

  /* =====================================
       LEVEL
    ===================================== */

  const level = getLevel(user.xp);

  document.getElementById("userLevel").textContent = level;

  /* =====================================
       NEXT LEVEL
    ===================================== */

  const nextLevelXP = getNextLevelXP(level);

  let previousLevelXP = 0;

  if (level === 2) {
    previousLevelXP = 100;
  } else if (level === 3) {
    previousLevelXP = 250;
  } else if (level === 4) {
    previousLevelXP = 450;
  } else if (level === 5) {
    previousLevelXP = 700;
  }

  const levelRange = nextLevelXP - previousLevelXP;

  const currentLevelXP = Math.max(0, user.xp - previousLevelXP);

  let progress = (currentLevelXP / levelRange) * 100;

  progress = Math.min(100, Math.max(0, progress));

  document.getElementById("xpProgress").style.width = `${progress}%`;

  document.getElementById("xpProgressText").textContent =
    `${user.xp} / ${nextLevelXP} XP`;

  /* =====================================
       STATISTICS
    ===================================== */

  document.getElementById("solvedCount").textContent = user.solved;

  document.getElementById("correctCount").textContent = user.correct;

  document.getElementById("wrongCount").textContent = user.wrong;

  /* =====================================
       ACCURACY
    ===================================== */

  let accuracy = 0;

  if (user.solved > 0) {
    accuracy = Math.round((user.correct / user.solved) * 100);
  }

  document.getElementById("accuracyPercent").textContent = `${accuracy}%`;

  document.getElementById("accuracyFill").style.width = `${accuracy}%`;
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", loadProfile);
