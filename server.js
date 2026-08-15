import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

/* =========================================
   HOME
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Yazdahom Riazi AI Backend is running",
  });
});

/* =========================================
   AI
========================================= */

app.post("/api/ai", async (req, res) => {
  try {
    const { question, image } = req.body || {};

    /* -----------------------------------------
       CHECK INPUT
    ----------------------------------------- */

    if (!question && !image) {
      return res.status(400).json({
        error: "Question or image is required",
      });
    }

    /* -----------------------------------------
       GEMINI API KEY
    ----------------------------------------- */

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
      });
    }

    /* -----------------------------------------
       PROMPT
    ----------------------------------------- */

    const prompt = `
تو دستیار هوشمند حسابان در یک سایت آموزشی برای دانش‌آموزان یازدهم رشته ریاضی هستی.

وظیفه تو کمک آموزشی به دانش‌آموز است.

اگر سؤال ریاضی دریافت کردی:

1. سؤال را دقیق بررسی کن.
2. روش حل را مرحله‌به‌مرحله توضیح بده.
3. فرمول‌های مورد نیاز را واضح بنویس.
4. محاسبات را مرحله‌به‌مرحله انجام بده.
5. جواب نهایی را کاملاً مشخص کن.
6. اگر چند روش مناسب وجود دارد، روش ساده‌تر را اول توضیح بده.
7. اگر سؤال یا تصویر واضح نیست، حدس نزن و بگو کدام قسمت مشخص نیست.
8. پاسخ را به زبان فارسی بده.
9. لحن پاسخ آموزشی و قابل فهم برای دانش‌آموز یازدهم باشد.

سؤال دانش‌آموز:

${question || "دانش‌آموز یک تصویر از سؤال ارسال کرده است. تصویر را با دقت بررسی و سؤال را حل کن."}
`;

    /* -----------------------------------------
       GEMINI CONTENT
    ----------------------------------------- */

    const parts = [
      {
        text: prompt,
      },
    ];

    /* -----------------------------------------
       IMAGE
    ----------------------------------------- */

    if (image) {
      const match = image.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
      );

      if (!match) {
        return res.status(400).json({
          error: "Invalid image format",
        });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
    }

    /* -----------------------------------------
       GEMINI REQUEST
    ----------------------------------------- */

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: parts,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    /* -----------------------------------------
       GEMINI ERROR
    ----------------------------------------- */

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API request failed",
      });
    }

    /* -----------------------------------------
       GET ANSWER
    ----------------------------------------- */

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim() || "";

    if (!answer) {
      return res.status(500).json({
        error: "AI returned an empty response",
      });
    }

    /* -----------------------------------------
       SUCCESS
    ----------------------------------------- */

    return res.status(200).json({
      success: true,
      answer: answer,
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Yazdahom AI Backend running on port ${PORT}`
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Yazdahom AI Backend running on port ${PORT}`);
});
