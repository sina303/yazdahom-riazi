const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("usernameInput");

const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();

  /* =========================
           VALIDATION
        ========================= */

  if (!username) {
    errorMessage.textContent = "لطفاً یک نام کاربری وارد کن.";

    return;
  }

  if (username.length < 3) {
    errorMessage.textContent = "نام کاربری باید حداقل ۳ کاراکتر باشد.";

    return;
  }

  if (username.length > 20) {
    errorMessage.textContent = "نام کاربری نباید بیشتر از ۲۰ کاراکتر باشد.";

    return;
  }

  /* =========================
           CREATE USER
        ========================= */

  createUser(username);

  /* =========================
           GO TO HOME
        ========================= */

  window.location.href = "index.html";
});
