import type { CollectionConfig } from "payload";

export const Parts: CollectionConfig = {
  slug: "parts",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sectionType", "questionCount", "createdAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
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
              defaultValue: [
                { optionText: "" },
                { optionText: "" },
                { optionText: "" },
                { optionText: "" },
              ],
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
    {
      name: "toeic",
      type: "relationship",
      relationTo: "toeic",
      hasMany: false,
    },
  ],
  timestamps: true,
};
