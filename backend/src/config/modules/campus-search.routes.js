
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const PUBLIC_COLLECTIONS = [
  {
    name: "qa",
    label: "QA",
    fields: ["question", "answer", "keywords", "category"],
  },
  {
    name: "departments",
    label: "Departments",
    fields: ["name", "departmentName", "description", "code", "hod"],
  },
  {
    name: "faculty",
    label: "Faculty",
    fields: [
      "name",
      "fullName",
      "designation",
      "department",
      "email",
      "specialization",
    ],
  },
  {
    name: "events",
    label: "Events",
    fields: [
      "title",
      "name",
      "description",
      "venue",
      "category",
      "tags",
      "status",
    ],
  },
  {
    name: "notices",
    label: "Notices",
    fields: [
      "title",
      "heading",
      "description",
      "content",
      "category",
    ],
  },
  {
    name: "library",
    label: "Library",
    fields: [
      "title",
      "author",
      "subject",
      "category",
      "description",
      "isbn",
      "availability",
    ],
  },
];

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function valueToText(value) {
  if (value == null) return "";

  if (Array.isArray(value)) {
    return value.map(valueToText).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(valueToText).join(" ");
  }

  return String(value);
}

function getFieldValue(record, path) {
  return path.split(".").reduce((value, key) => {
    if (Array.isArray(value)) {
      return value.map((item) => item?.[key] ?? item);
    }

    return value?.[key];
  }, record);
}

function getSearchableText(record, fields) {
  return fields
    .map((field) => valueToText(getFieldValue(record, field)))
    .join(" ")
    .toLowerCase();
}

function detectIntent(search) {
  const text = normalize(search);

  if (
    /\b(book|books|author|isbn|borrow|issue|renew|catalogue|catalog|library)\b/.test(
      text
    )
  ) {
    return "library";
  }

  if (
    /\b(event|events|upcoming|workshop|seminar|fest|activity|activities)\b/.test(
      text
    )
  ) {
    return "events";
  }

  if (
    /\b(department|departments|branch|branches|hod)\b/.test(text)
  ) {
    return "departments";
  }

  if (
    /\b(faculty|professor|teacher|lecturer|specialization)\b/.test(text)
  ) {
    return "faculty";
  }

  if (
    /\b(notice|notices|announcement|announcements)\b/.test(text)
  ) {
    return "notices";
  }

  return null;
}

function getRecordTitle(record) {
  return normalize(
    record.title ||
      record.name ||
      record.departmentName ||
      record.fullName ||
      record.heading ||
      ""
  );
}

function scoreRecord(record, source, terms, search, intent) {
  const normalizedSearch = normalize(search);
  const searchableText = normalize(
    getSearchableText(record, source.fields)
  );

  if (!searchableText || !normalizedSearch) return 0;

  const question = normalize(record.question);
  const title = getRecordTitle(record);
  const keywords = normalize(valueToText(record.keywords));

  let score = 0;

  // Exact record title should rank very highly.
  if (title && title === normalizedSearch) {
    score += 100;
  } else if (title && title.includes(normalizedSearch)) {
    score += 50;
  }

  // Exact QA question is useful for question-style queries.
  if (question && question === normalizedSearch) {
    score += 80;
  } else if (question && question.includes(normalizedSearch)) {
    score += 30;
  }

  // Prefer the collection matching the detected intent.
  if (intent === source.name) {
    score += 25;
  }

  // Actual library records should rank above generic QA for book searches.
  if (intent === "library" && source.name === "library") {
    score += 40;
  }

  // Give QA a small bonus only when the query is not aimed at another module.
  if (source.name === "qa" && !intent && record.answer) {
    score += 5;
  }

  for (const term of terms) {
    if (title && title.includes(term)) {
      score += 10;
    } else if (question && question.includes(term)) {
      score += 6;
    } else if (keywords && keywords.includes(term)) {
      score += 5;
    } else if (searchableText.includes(term)) {
      score += 1;
    }
  }

  // If the query is an exact title, avoid unrelated QA answers outranking it.
  if (
    intent &&
    source.name === "qa" &&
    title !== normalizedSearch &&
    question !== normalizedSearch
  ) {
    score -= 10;
  }

  return score;
}

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected",
      });
    }

    const search = String(req.query.search || "").trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const normalizedSearch = normalize(search);
    const terms = [...new Set(normalizedSearch.split(" ").filter(Boolean))];
    const intent = detectIntent(search);
    const results = [];

    for (const source of PUBLIC_COLLECTIONS) {
      const records = await db
        .collection(source.name)
        .find({})
        .limit(200)
        .toArray();

      for (const record of records) {
        const score = scoreRecord(record, source, terms, search, intent);

        if (score > 0) {
          results.push({
            ...record,
            _id: String(record._id),
            source: source.name,
            category: record.category || source.label,
            relevance: score,
          });
        }
      }
    }

    results.sort((a, b) => b.relevance - a.relevance);

    const data = results.slice(0, 10);

    return res.status(200).json({
      success: true,
      count: data.length,
      intent,
      data,
    });
  } catch (error) {
    console.error("Campus search API error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search campus information",
    });
  }
});

module.exports = router;
