import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  }),
);

/* =========================================
   DATABASE TEST
========================================= */

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      database: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

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

    if (!question && !image) {
      return res.status(400).json({
        error: "Question or image is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const prompt = `

تو دستیار هوشمند حسابان یک سایت آموزشی برای دانش‌آموزان یازدهم رشته ریاضی هستی.

سؤال را دقیق بررسی کن.

روش حل را مرحله به مرحله توضیح بده.

فرمول‌ها و محاسبات را واضح بنویس.

جواب نهایی را مشخص کن.

پاسخ را فارسی و آموزشی بده.


سؤال:

${question || "تصویر سؤال را بررسی کن"}

`;

    const input = [
      {
        type: "text",
        text: prompt,
      },
    ];

    if (image) {
      const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

      if (!match) {
        return res.status(400).json({
          error: "Invalid image format",
        });
      }

      input.push({
        type: "image",
        mime_type: match[1],
        data: match[2],
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "x-goog-api-key": apiKey,
        },

        body: JSON.stringify({
          model: "gemini-3.6-flash",

          input: input,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: data?.error?.message || "Gemini error",
      });
    }

    let answer = "";

    if (Array.isArray(data.steps)) {
      for (const step of data.steps) {
        if (step.type === "model_output") {
          for (const item of step.content || []) {
            if (item.type === "text") {
              answer += item.text;
            }
          }
        }
      }
    }

    res.json({
      success: true,

      answer: answer.trim(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Yazdahom AI Backend running on port ${PORT}`);
});
