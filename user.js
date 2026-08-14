const USER_STORAGE_KEY = "y11_math_user";

const DEFAULT_USER = {
  username: "",
  xp: 0,
  solved: 0,
  correct: 0,
  wrong: 0,
  solvedQuestions: [],
};

/* =========================================
   GET USER
========================================= */

function getUser() {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!savedUser) {
    return {
      ...DEFAULT_USER,
      solvedQuestions: [],
    };
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("User data is corrupted.", error);

    return {
      ...DEFAULT_USER,
      solvedQuestions: [],
    };
  }
}

/* =========================================
   SAVE USER
========================================= */

function saveUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/* =========================================
   CREATE USER
========================================= */

function createUser(username) {
  const user = {
    ...DEFAULT_USER,

    username: username.trim(),
  };

  saveUser(user);

  return user;
}

/* =========================================
   XP
========================================= */

function addXP(amount) {
  const user = getUser();

  user.xp += amount;

  saveUser(user);

  return user;
}

/* =========================================
   LEVEL
========================================= */

function getLevel(xp) {
  if (xp >= 700) return 5;

  if (xp >= 450) return 4;

  if (xp >= 250) return 3;

  if (xp >= 100) return 2;

  return 1;
}

/* =========================================
   NEXT LEVEL XP
========================================= */

function getNextLevelXP(level) {
  const levels = {
    1: 100,
    2: 250,
    3: 450,
    4: 700,
    5: 1000,
  };

  return levels[level] || 1000;
}

/* =========================================
   REGISTER ANSWER
========================================= */

function registerAnswer(questionId, isCorrect) {
  const user = getUser();

  /*
        اگر قبلاً این سؤال ثبت شده،
        دوباره XP نده.
    */

  const alreadySolved = user.solvedQuestions.includes(questionId);

  if (!alreadySolved) {
    user.solvedQuestions.push(questionId);

    user.solved++;

    if (isCorrect) {
      user.correct++;

      user.xp += 10;
    } else {
      user.wrong++;
    }
  }

  saveUser(user);

  return user;
}
