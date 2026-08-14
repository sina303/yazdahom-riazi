/* =========================================
   AI IMAGE
========================================= */

let selectedAIImage = null;

/* =========================================
   IMAGE INPUT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("aiImageInput");

  if (!imageInput) {
    return;
  }

  imageInput.addEventListener("change", handleAIImage);
});

/* =========================================
   HANDLE IMAGE
========================================= */

function handleAIImage(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("لطفاً یک تصویر انتخاب کن.");

    return;
  }

  selectedAIImage = file;

  const reader = new FileReader();

  reader.onload = function (e) {
    const preview = document.getElementById("aiPreviewImage");

    const previewBox = document.getElementById("aiImagePreview");

    if (preview) {
      preview.src = e.target.result;
    }

    if (previewBox) {
      previewBox.classList.remove("hidden");
    }
  };

  reader.readAsDataURL(file);
}

/* =========================================
   REMOVE IMAGE
========================================= */

function removeAIImage() {
  selectedAIImage = null;

  const imageInput = document.getElementById("aiImageInput");

  const preview = document.getElementById("aiPreviewImage");

  const previewBox = document.getElementById("aiImagePreview");

  if (imageInput) {
    imageInput.value = "";
  }

  if (preview) {
    preview.src = "";
  }

  if (previewBox) {
    previewBox.classList.add("hidden");
  }
}

/* =========================================
   ASK AI
========================================= */

function askAI() {
  const input = document.getElementById("aiQuestion");

  const response = document.getElementById("aiResponse");

  const responseContent = document.getElementById("aiResponseContent");

  const question = input ? input.value.trim() : "";

  if (!question && !selectedAIImage) {
    alert("اول سؤال را بنویس یا یک عکس ارسال کن.");

    return;
  }

  if (!response || !responseContent) {
    return;
  }

  response.classList.remove("hidden");

  responseContent.innerHTML = `

        <div class="ai-thinking">

            🤖
            در حال بررسی سؤال...

        </div>

    `;

  /*
        فعلاً API واقعی متصل نشده.

        این قسمت در مرحله بعد
        به AI واقعی وصل خواهد شد.
    */

  setTimeout(() => {
    responseContent.innerHTML = `

            <div class="ai-demo-message">

                <strong>
                    🤖 دستیار حسابان
                </strong>

                <p>
                    رابط AI آماده است.
                    در مرحله بعد، این قسمت به هوش مصنوعی واقعی
                    متصل می‌شود تا سؤال متنی یا تصویری را بررسی
                    و مرحله‌به‌مرحله حل کند.
                </p>

                ${
                  selectedAIImage
                    ? `
                            <div class="ai-image-status">
                                📷 تصویر سؤال دریافت شد.
                            </div>
                        `
                    : ""
                }

            </div>

        `;
  }, 800);
}
