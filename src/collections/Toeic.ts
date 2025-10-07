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
      defaultValue: 120,
    },
    {
      name: "totalQuestions",
      type: "number",
      required: true,
      label: "Total questions",
      defaultValue: 200,
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
    {
      name: "audioFile",
      type: "upload",
      relationTo: "media",
      label: "Audio file (for listening parts)",
    },
    {
      name: "parts",
      type: "array",
      label: "Parts",
      fields: [
        {
          name: "description",
          type: "textarea",
          label: "Part description",
        },
        {
          name: "sectionType",
          type: "select",
          required: true,
          options: [
            { label: "Listening", value: "listening" },
            { label: "Reading", value: "reading" },
          ],
          defaultValue: "listening",
          label: "Section type",
        },
        {
          name: "questionCount",
          type: "number",
          required: true,
          label: "Question count",
        },
        {
          name: "questionItems",
          type: "array",
          label: "Question items (single questions or question groups)",
          fields: [
            {
              name: "questionContent",
              type: "richText",
            },
            {
              name: "questions",
              type: "array",
              minRows: 1,
              maxRows: 5,
              fields: [
                {
                  name: "questionNumber",
                  type: "number",
                  required: true,
                },
                {
                  name: "questionText",
                  type: "textarea",
                },
                {
                  name: "options",
                  type: "array",
                  label: "Answer options",
                  minRows: 2,
                  maxRows: 4,
                  fields: [
                    {
                      name: "optionText",
                      type: "text",
                      required: true,
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
      name: "answers",
      type: "array",
      label: "Answers (for all questions)",
      fields: [
        {
          name: "ordinal",
          type: "number",
          required: true,
          label: "Ordinal (1-200)",
        },
        {
          name: "answer",
          type: "number",
          required: true,
          label: "Answer (index starting from 1)",
        },
        {
          name: "explanation",
          type: "textarea",
          label: "Explanation",
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
