import type { CollectionConfig } from "payload";

export const Progress: CollectionConfig = {
  slug: "progress",
  admin: {
    useAsTitle: "skill",
    defaultColumns: [
      "user",
      "skill",
      "totalTestsCompleted",
      "bestScore",
      "updatedAt",
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "skill",
      type: "select",
      required: true,
      options: [
        { label: "TOEIC", value: "toeic" },
        { label: "IELTS", value: "ielts" },
      ],
    },
    {
      name: "studyStreak",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "lastStudyDate",
      type: "date",
    },
    {
      name: "totalTestsCompleted",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "averageScore",
      type: "number",
    },
    {
      name: "skillsAverage",
      label: "Sub-skills Average Scores",
      type: "array",
      fields: [
        {
          name: "subSkill",
          label: "Sub-skill",
          type: "select",
          required: true,
          options: [
            { label: "Listening", value: "listening" },
            { label: "Reading", value: "reading" },
            { label: "Writing", value: "writing" },
            { label: "Speaking", value: "speaking" },
          ],
        },
        {
          name: "averageScore",
          label: "Average Score",
          type: "number",
        },
      ],
    },
    {
      name: "bestScore",
      type: "number",
    },
    {
      name: "learningGoals",
      type: "group",
      fields: [
        {
          name: "targetScore",
          type: "number",
          min: 0,
          max: 990,
        },
      ],
    },
  ],
  timestamps: true,
};
