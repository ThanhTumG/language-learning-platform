import { isSuperAdmin } from "@/lib/utils";
import type { CollectionConfig } from "payload";

export const Toeic: CollectionConfig = {
  slug: "toeic",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "duration", "totalQuestions", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (isSuperAdmin(user)) return true;
      if (user) {
        return { "metadata.createdBy": { equals: user.id } };
      }
      return false;
    },
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
      name: "isPractice",
      type: "checkbox",
      defaultValue: true,
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
          access: {
            update: ({ req }) => isSuperAdmin(req.user),
            create: ({ req }) => isSuperAdmin(req.user),
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
