import { isSuperAdmin } from "@/lib/utils";
import type { CollectionConfig, Where } from "payload";

export const Progress: CollectionConfig = {
  slug: "progress",
  admin: {
    useAsTitle: "user",
    defaultColumns: ["user", "updatedAt"],
    listSearchableFields: ["user"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (isSuperAdmin(user)) return true;
      if (user) {
        const where: Where = {
          "user.class.user": { equals: user.id },
        };
        return where;
      }
      return false;
    },
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "skill",
      type: "array",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            { label: "TOEIC", value: "toeic" },
            { label: "IELTS", value: "ielts" },
          ],
        },
        {
          name: "totalStudyTime",
          type: "number",
          min: 0,
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
    },
  ],
  timestamps: true,
};
