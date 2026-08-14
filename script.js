/* =========================================
   USER ACCESS
========================================= */

function checkUserAccess() {
  const user = getUser();

  const isLoginPage = window.location.pathname.endsWith("login.html");

  if (!user.username && !isLoginPage) {
    window.location.href = "login.html";

    return false;
  }

  return true;
}

/* =========================================
   USER INFO
========================================= */

function updateUserInfo() {
  const user = getUser();

  const usernameElement = document.getElementById("headerUsername");

  const xpElement = document.getElementById("headerXP");

  const levelElement = document.getElementById("headerLevel");

  if (usernameElement) {
    usernameElement.textContent = user.username || "کاربر";
  }

  if (xpElement) {
    xpElement.textContent = user.xp;
  }

  if (levelElement) {
    levelElement.textContent = getLevel(user.xp);
  }
}

/* =========================================
   HOME
========================================= */

function openSubject(subject) {
  if (subject === "hesaban") {
    window.location.href = "hesaban.html";
  }
}

function scrollToChapters() {
  const chapters = document.getElementById("chapters");

  if (chapters) {
    chapters.scrollIntoView({
      behavior: "smooth",
    });
  }
}

/* =========================================
   LOAD HESABAN
========================================= */

async function loadHesaban() {
  const chaptersGrid = document.getElementById("chaptersGrid");

  if (!chaptersGrid) {
    return;
  }

  try {
    const response = await fetch("data/subjects.json");

    if (!response.ok) {
      throw new Error("Could not load subjects.json");
    }

    const data = await response.json();

    const hesaban = data.subjects.find((subject) => subject.id === "hesaban");

    if (!hesaban) {
      throw new Error("Hesaban not found");
    }

    renderChapters(hesaban.chapters);
  } catch (error) {
    console.error(error);

    chaptersGrid.innerHTML = `

            <div class="loading">

                خطا در بارگذاری فصل‌ها

            </div>

        `;
  }
}

/* =========================================
   RENDER CHAPTERS
========================================= */

function renderChapters(chapters) {
  const chaptersGrid = document.getElementById("chaptersGrid");

  if (!chaptersGrid) {
    return;
  }

  chaptersGrid.innerHTML = "";

  chapters.forEach((chapter) => {
    const card = document.createElement("div");

    card.className = "chapter-card";

    card.innerHTML = `

            <div class="chapter-number">

                ${String(chapter.number).padStart(2, "0")}

            </div>


            <div class="chapter-content">

                <h3>
                    ${chapter.title}
                </h3>


                <p>
                    ${chapter.description}
                </p>


                <div class="chapter-progress">

                    <span>
                        پیشرفت
                        ${chapter.progress}%
                    </span>


                    <div>

                        <i
                            style="
                                width:
                                ${chapter.progress}%
                            "
                        ></i>

                    </div>

                </div>

            </div>


            <button
                onclick="
                    openChapter(
                        '${chapter.id}'
                    )
                "
            >
                ورود →
            </button>

        `;

    chaptersGrid.appendChild(card);
  });
}

/* =========================================
   OPEN CHAPTER
========================================= */

function openChapter(chapterId) {
  window.location.href =
    "chapter.html?chapter=" + encodeURIComponent(chapterId);
}

/* =========================================
   LOAD CHAPTER
========================================= */

async function loadChapter() {
  const lessonGrid = document.getElementById("lessonGrid");

  if (!lessonGrid) {
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);

    const chapterId = params.get("chapter");

    if (!chapterId) {
      throw new Error("Chapter ID not found");
    }

    const response = await fetch("data/subjects.json");

    if (!response.ok) {
      throw new Error("Could not load data");
    }

    const data = await response.json();

    const hesaban = data.subjects.find((subject) => subject.id === "hesaban");

    if (!hesaban) {
      throw new Error("Subject not found");
    }

    const chapter = hesaban.chapters.find(
      (chapter) => chapter.id === chapterId,
    );

    if (!chapter) {
      throw new Error("Chapter not found");
    }

    renderLessons(chapter.lessons);
  } catch (error) {
    console.error(error);

    lessonGrid.innerHTML = `

            <div class="loading">

                خطا در بارگذاری درس‌ها

            </div>

        `;
  }
}

/* =========================================
   RENDER LESSONS
========================================= */

function renderLessons(lessons) {
  const lessonGrid = document.getElementById("lessonGrid");

  if (!lessonGrid) {
    return;
  }

  lessonGrid.innerHTML = "";

  if (!lessons || lessons.length === 0) {
    lessonGrid.innerHTML = `

            <div class="loading">

                هنوز محتوایی برای این فصل
                اضافه نشده.

            </div>

        `;

    return;
  }

  lessons.forEach((lesson) => {
    const card = document.createElement("article");

    card.className = "lesson-card";

    card.innerHTML = `

            <div class="lesson-icon">

                ${String(lesson.number).padStart(2, "0")}

            </div>


            <div>

                <h3>
                    ${lesson.title}
                </h3>


                <p>
                    ${lesson.description}
                </p>

            </div>


            <button
                onclick="
                    openLesson(
                        '${lesson.id}'
                    )
                "
            >
                مطالعه →
            </button>

        `;

    lessonGrid.appendChild(card);
  });
}

/* =========================================
   OPEN LESSON
========================================= */

function openLesson(lessonId) {
  window.location.href = "lesson.html?lesson=" + encodeURIComponent(lessonId);
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /*
            اول بررسی می‌کنیم کاربر
            وارد شده یا نه.
        */

  const access = checkUserAccess();

  if (!access) {
    return;
  }

  /*
            اطلاعات کاربر را در Header
            قرار می‌دهیم.
        */

  updateUserInfo();

  /*
            محتوای قبلی سایت
        */

  loadHesaban();

  loadChapter();
});
