import { isSuperAdmin } from "@/lib/utils";
import type { CollectionConfig } from "payload";

export const Exams: CollectionConfig = {
  slug: "exams",
  admin: {
    useAsTitle: "title",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "test",
      type: "relationship",
      relationTo: "toeic",
      hasMany: false,
      required: true,
    },
    {
      name: "results",
      type: "relationship",
      relationTo: "toeic-attempts",
      hasMany: true,
    },
    {
      name: "startTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "endTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "numberOfParticipants",
      type: "number",
      admin: {
        readOnly: true,
      },
      defaultValue: 0,
    },
  ],
};
