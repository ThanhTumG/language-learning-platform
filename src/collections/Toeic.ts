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
      type: "relationship",
      relationTo: "parts",
      hasMany: true,
      label: "Parts",
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
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: "answers",
      type: "array",
      label: "Answers (for all questions)",
      fields: [
        {
          name: "answer",
          type: "number",
          required: true,
          label: "Answer key (1 - 4)",
        },
        {
          name: "explanation",
          type: "textarea",
          label: "Explanation",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === "create" && req.user) {
          data.metadata = { ...data.metadata, createdBy: req.user.id };
        }
      },
    ],
  },
  timestamps: true,
};
