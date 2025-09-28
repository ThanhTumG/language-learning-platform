import type { CollectionConfig } from "payload";

export const Toeic: CollectionConfig = {
  slug: "toeic",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "duration", "totalQuestions", "createdAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "duration",
      type: "number",
      required: true,
      label: "Total duration (minute)",
      defaultValue: 120, // 45 Listening + 75 Reading
    },
    {
      name: "totalQuestions",
      type: "number",
      required: true,
      label: "Total questions",
      defaultValue: 200,
    },
    {
      name: "listeningSection",
      type: "group",
      label: "Listening section",
      fields: [
        {
          name: "duration",
          type: "number",
          required: true,
          label: "Duration (minute)",
          defaultValue: 45,
        },
        {
          name: "totalQuestions",
          type: "number",
          required: true,
          label: "Total questions",
          defaultValue: 100,
        },
        {
          name: "parts",
          type: "array",
          label: "Parts",
          fields: [
            {
              name: "partNumber",
              type: "number",
              required: true,
              label: "Ordinal part",
            },
            {
              name: "title",
              type: "text",
              required: true,
              label: "Title",
            },
            {
              name: "description",
              type: "textarea",
              label: "Description",
            },
            {
              name: "questionCount",
              type: "number",
              required: true,
              label: "Question count",
            },
            {
              name: "questions",
              type: "array",
              label: "Question list",
              fields: [
                {
                  name: "questionNumber",
                  type: "number",
                  required: true,
                  label: "Ordinal question",
                },
                {
                  name: "questionText",
                  type: "textarea",
                  label: "Question text",
                },
                {
                  name: "audioFile",
                  type: "upload",
                  relationTo: "media",
                  label: "Audio file",
                },
                {
                  name: "imageFile",
                  type: "upload",
                  relationTo: "media",
                  label: "Image file (Part 1)",
                },
                {
                  name: "options",
                  type: "array",
                  label: "Options",
                  fields: [
                    {
                      name: "option",
                      type: "text",
                      required: true,
                      label: "Option text",
                    },
                    {
                      name: "isCorrect",
                      type: "checkbox",
                    },
                  ],
                },
                {
                  name: "correctAnswer",
                  type: "text",
                  required: true,
                  label: "Correct answer",
                },
                {
                  name: "explanation",
                  type: "textarea",
                  label: "Explanation",
                },
                {
                  name: "difficulty",
                  type: "select",
                  options: [
                    { label: "Easy", value: "easy" },
                    { label: "Medium", value: "medium" },
                    { label: "Hard", value: "hard" },
                  ],
                  defaultValue: "medium",
                  label: "Difficulty",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "readingSection",
      type: "group",
      label: "Reading section",
      fields: [
        {
          name: "duration",
          type: "number",
          required: true,
          label: "Duration (minute)",
          defaultValue: 75,
        },
        {
          name: "totalQuestions",
          type: "number",
          required: true,
          label: "Total questions",
          defaultValue: 100,
        },
        {
          name: "parts",
          type: "array",
          label: "Parts",
          fields: [
            {
              name: "partNumber",
              type: "number",
              required: true,
              label: "Ordinal part",
            },
            {
              name: "title",
              type: "text",
              required: true,
              label: "Title",
            },
            {
              name: "description",
              type: "textarea",
              label: "Description",
            },
            {
              name: "questionCount",
              type: "number",
              required: true,
              label: "Question count",
            },
            {
              name: "passages",
              type: "array",
              label: "Passages",
              fields: [
                {
                  name: "passageNumber",
                  type: "number",
                  required: true,
                  label: "Ordinal passage",
                },
                {
                  name: "title",
                  type: "text",
                  label: "Title",
                },
                {
                  name: "content",
                  type: "richText",
                  label: "Content",
                },
                {
                  name: "questions",
                  type: "array",
                  label: "Questions",
                  fields: [
                    {
                      name: "questionNumber",
                      type: "number",
                      required: true,
                      label: "Ordinal question",
                    },
                    {
                      name: "questionText",
                      type: "textarea",
                      required: true,
                      label: "Question text",
                    },
                    {
                      name: "options",
                      type: "array",
                      label: "Options",
                      fields: [
                        {
                          name: "option",
                          type: "text",
                          required: true,
                          label: "Option text",
                        },
                        {
                          name: "isCorrect",
                          type: "checkbox",
                        },
                      ],
                    },
                    {
                      name: "correctAnswer",
                      type: "text",
                      required: true,
                      label: "Correct answer",
                    },
                    {
                      name: "explanation",
                      type: "textarea",
                      label: "Explanation",
                    },
                    {
                      name: "difficulty",
                      type: "select",
                      options: [
                        { label: "Easy", value: "easy" },
                        { label: "Medium", value: "medium" },
                        { label: "Hard", value: "hard" },
                      ],
                      defaultValue: "medium",
                      label: "Difficulty",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "scoring",
      type: "group",
      label: "Scoring",
      fields: [
        {
          name: "listeningMaxScore",
          type: "number",
          required: true,
          label: "Listening max score",
          defaultValue: 495,
        },
        {
          name: "readingMaxScore",
          type: "number",
          required: true,
          label: "Reading max score",
          defaultValue: 495,
        },
        {
          name: "totalMaxScore",
          type: "number",
          required: true,
          label: "Total max score",
          defaultValue: 990,
        },
      ],
    },
    {
      name: "metadata",
      type: "group",
      label: "Additional data",
      fields: [
        {
          name: "level",
          type: "select",
          options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
          ],
          label: "Level",
        },
        {
          name: "tags",
          type: "array",
          label: "Tags",
          fields: [
            {
              name: "tag",
              type: "text",
              required: true,
              label: "Tag",
            },
          ],
        },
        {
          name: "isPublished",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "createdBy",
          type: "relationship",
          relationTo: "users",
          label: "Test Owner",
        },
      ],
    },
  ],
  timestamps: true,
};
