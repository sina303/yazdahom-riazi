import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Yazdahom Riazi AI Backend is running",
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { question, image } = req.body || {};

    if (!question && !image) {
      return res.status(400).json({
        error: "Question or image is required",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured",
      });
    }

    const content = [];

    if (question) {
      content.push({
        type: "input_text",
        text: `
تو دستیار هوشمند حسابان یک سایت آموزشی برای دانش‌آموزان یازدهم ریاضی هستی.

سؤال دانش‌آموز:

${question}

لطفاً:
1. سؤال را دقیق بررسی کن.
2. روش حل را مرحله‌به‌مرحله توضیح بده.
3. محاسبات را واضح بنویس.
4. جواب نهایی را مشخص کن.
5. اگر سؤال مبهم بود، حدس نزن و بگو چه چیزی نامشخص است.

پاسخ را به زبان فارسی بده.
        `,
      });
    }

    if (image) {
      content.push({
        type: "input_image",
        image_url: image,
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: "gpt-5-mini",

          input: [
            {
              role: "user",
              content: content,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "AI request failed",
      });
    }

    return res.status(200).json({
      success: true,
      answer: data.output_text || "",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Yazdahom AI Backend running on port ${PORT}`);
});
