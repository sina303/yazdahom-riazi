let currentLesson = null;

/* =========================================
   LOAD LESSON
========================================= */

async function loadLesson() {
  try {
    const params = new URLSearchParams(window.location.search);

    const lessonId = params.get("lesson");

    if (!lessonId) {
      throw new Error("Lesson ID not found");
    }

    const response = await fetch("data/subjects.json");

    if (!response.ok) {
      throw new Error("Could not load subjects.json");
    }

    const data = await response.json();

    const hesaban = data.subjects.find((subject) => subject.id === "hesaban");

    if (!hesaban) {
      throw new Error("Hesaban not found");
    }

    let foundLesson = null;
    let foundChapter = null;

    /* پیدا کردن درس */

    for (const chapter of hesaban.chapters) {
      const lesson = chapter.lessons?.find((lesson) => lesson.id === lessonId);

      if (lesson) {
        foundLesson = lesson;
        foundChapter = chapter;
        break;
      }
    }

    if (!foundLesson) {
      throw new Error("Lesson not found");
    }

    currentLesson = foundLesson;

    /* =========================================
       LESSON INFORMATION
    ========================================= */

    const lessonNumber = document.getElementById("lessonNumber");
    const lessonTitle = document.getElementById("lessonTitle");
    const lessonDescription = document.getElementById("lessonDescription");

    const breadcrumbLesson = document.getElementById("breadcrumbLesson");

    const backToChapter = document.getElementById("backToChapter");

    if (lessonNumber) {
      lessonNumber.textContent = `درس ${foundLesson.number}`;
    }

    if (lessonTitle) {
      lessonTitle.textContent = foundLesson.title;
    }

    if (lessonDescription) {
      lessonDescription.textContent = foundLesson.description;
    }

    if (breadcrumbLesson) {
      breadcrumbLesson.textContent = foundLesson.title;
    }

    if (backToChapter) {
      backToChapter.href = `chapter.html?chapter=${foundChapter.id}`;
    }

    /* =========================================
       LOAD CONTENT
    ========================================= */

    renderLessonContent(foundLesson);
  } catch (error) {
    console.error(error);

    const bookQuestionsList = document.getElementById("bookQuestionsList");

    const customQuestionsList = document.getElementById("customQuestionsList");

    if (bookQuestionsList) {
      bookQuestionsList.innerHTML = `
        <div class="loading">
          خطا در بارگذاری درس.
        </div>
      `;
    }

    if (customQuestionsList) {
      customQuestionsList.innerHTML = `
        <div class="loading">
          خطا در بارگذاری درس.
        </div>
      `;
    }
  }
}

/* =========================================
   RENDER LESSON CONTENT
========================================= */

function renderLessonContent(lesson) {
  /*
    در آینده این اطلاعات را از subjects.json
    می‌گیریم.
  */

  renderBookQuestions(lesson.bookQuestions || []);

  renderCustomQuestions(lesson.customQuestions || []);

  renderExam(lesson.examQuestions || []);

  updateQuestionCounts(
    lesson.bookQuestions || [],
    lesson.customQuestions || [],
  );
}

/* =========================================
   BOOK QUESTIONS
========================================= */

function renderBookQuestions(questions) {
  const container = document.getElementById("bookQuestionsList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="loading">

        <div style="font-size: 30px; margin-bottom: 10px;">
          📕
        </div>

        <strong>
          هنوز سؤال‌های کتاب اضافه نشده
        </strong>

        <p style="
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
        ">
          سؤال‌های این بخش بعداً به سیستم اضافه می‌شوند.
        </p>

      </div>
    `;

    return;
  }

  questions.forEach((question, index) => {
    const card = createQuestionCard(question, index + 1, "book");

    container.appendChild(card);
  });
}

/* =========================================
   CUSTOM QUESTIONS
========================================= */

function renderCustomQuestions(questions) {
  const container = document.getElementById("customQuestionsList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="loading">

        <div style="font-size: 30px; margin-bottom: 10px;">
          🧠
        </div>

        <strong>
          هنوز تمرینی اضافه نشده
        </strong>

        <p style="
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
        ">
          تمرین‌های تألیفی بعداً به این بخش اضافه می‌شوند.
        </p>

      </div>
    `;

    return;
  }

  questions.forEach((question, index) => {
    const card = createQuestionCard(question, index + 1, "custom");

    container.appendChild(card);
  });
}

/* =========================================
   CREATE QUESTION CARD
========================================= */

function createQuestionCard(question, number, type) {
  const article = document.createElement("article");

  article.className = "question-card";

  const difficulty = question.difficulty || "متوسط";

  const questionText = question.question || "متن سؤال";

  const questionImage = question.image || "";

  article.innerHTML = `

    <div class="question-top">

      <span class="question-number">
        سؤال ${number}
      </span>

      <span class="difficulty">
        ${difficulty}
      </span>

    </div>


    <div class="question-text">

      ${questionText}

    </div>


    ${
      questionImage
        ? `
          <div class="question-image">

            <img
              src="${questionImage}"
              alt="تصویر سؤال"
              loading="lazy"
            >

          </div>
        `
        : ""
    }


    <div class="question-source">

      ${type === "book" ? "📕 سؤال کتاب درسی" : "🧠 سؤال یازدهم‌پلاس"}

    </div>


    ${
      question.answer
        ? `
          <button
            class="solution-button"
            onclick="toggleAnswer(this)"
          >
            نمایش پاسخ
          </button>

          <div class="answer hidden">

            <div class="answer-title">
              ✅ پاسخ
            </div>

            <p>
              ${question.answer}
            </p>

            ${
              question.solution
                ? `
                  <p class="solution">
                    ${question.solution}
                  </p>
                `
                : ""
            }

          </div>
        `
        : ""
    }

  `;

  return article;
}

/* =========================================
   SHOW / HIDE ANSWER
========================================= */

function toggleAnswer(button) {
  const answer = button.nextElementSibling;

  if (!answer) {
    return;
  }

  const isHidden = answer.classList.contains("hidden");

  if (isHidden) {
    answer.classList.remove("hidden");

    button.textContent = "بستن پاسخ";
  } else {
    answer.classList.add("hidden");

    button.textContent = "نمایش پاسخ";
  }
}

/* =========================================
   QUESTION COUNTS
========================================= */

function updateQuestionCounts(bookQuestions, customQuestions) {
  const bookCount = document.getElementById("bookCount");

  const customCount = document.getElementById("customCount");

  if (bookCount) {
    bookCount.textContent = `${bookQuestions.length} سؤال`;
  }

  if (customCount) {
    customCount.textContent = `${customQuestions.length} سؤال`;
  }
}

/* =========================================
   EXAM
========================================= */

function renderExam(questions) {
  const examSection = document.getElementById("examSection");

  if (!examSection) {
    return;
  }

  if (questions && questions.length > 0) {
    examSection.innerHTML = `

      <div class="section-title">

        <div>

          <span>
            🎯 آزمون
          </span>

          <h2>
            آزمون این درس
          </h2>

          <p>
            آزمون اختصاصی این درس
          </p>

        </div>

        <div class="section-badge">
          ${questions.length} سؤال
        </div>

      </div>


      <div class="exam-placeholder">

        <div class="exam-placeholder-icon">
          🎯
        </div>

        <h3>
          آزمون آماده است
        </h3>

        <p>
          سیستم آزمون در مرحله بعدی فعال می‌شود.
        </p>

      </div>

    `;
  }
}

/* =========================================
   SECTION SWITCHER
========================================= */

function selectLessonSection(section, button) {
  const sections = {
    book: document.getElementById("bookSection"),

    custom: document.getElementById("customSection"),

    exam: document.getElementById("examSection"),
  };

  /* مخفی کردن همه */

  Object.values(sections).forEach((element) => {
    if (element) {
      element.classList.add("hidden");
    }
  });

  /* نمایش بخش انتخاب‌شده */

  if (sections[section]) {
    sections[section].classList.remove("hidden");
  }

  /* حذف active */

  document.querySelectorAll(".content-type").forEach((item) => {
    item.classList.remove("active");
  });

  /* active کردن دکمه */

  if (button) {
    button.classList.add("active");
  }
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", loadLesson);
