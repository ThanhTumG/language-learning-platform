import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "fullname", "createdAt"],
  },
  auth: true,
  fields: [
    {
      name: "fullname",
      required: true,
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "class",
      type: "relationship",
      relationTo: "classes",
      hasMany: true,
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "business", "user"],
    },
  ],
  timestamps: true,
};
