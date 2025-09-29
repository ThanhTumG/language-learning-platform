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
    // Các trường tiến độ đã được tách sang collection Progress
    // {
    //   name: "achievements",
    //   type: "array",
    //   fields: [
    //     {
    //       name: "achievementType",
    //       type: "select",
    //       options: [
    //         { label: "Study Streak", value: "study_streak" },
    //         { label: "High Score", value: "high_score" },
    //         { label: "Test Completion", value: "test_completion" },
    //         { label: "Improvement", value: "improvement" },
    //       ],
    //       required: true,
    //     },
    //     {
    //       name: "title",
    //       type: "text",
    //       required: true,
    //     },
    //     {
    //       name: "description",
    //       type: "textarea",
    //     },
    //     {
    //       name: "earnedDate",
    //       type: "date",
    //       required: true,
    //     },
    //     {
    //       name: "badgeIcon",
    //       type: "text",
    //     },
    //   ],
    // },
    // {
    //   name: "preferences",
    //   type: "group",
    //   label: "Tùy chọn cá nhân",
    //   fields: [
    //     {
    //       name: "language",
    //       type: "select",
    //       options: [
    //         { label: "Tiếng Việt", value: "vi" },
    //         { label: "English", value: "en" },
    //       ],
    //       defaultValue: "vi",
    //       label: "Ngôn ngữ",
    //     },
    //     {
    //       name: "timezone",
    //       type: "text",
    //       label: "Múi giờ",
    //       defaultValue: "Asia/Ho_Chi_Minh",
    //     },
    //     {
    //       name: "notifications",
    //       type: "group",
    //       label: "Thông báo",
    //       fields: [
    //         {
    //           name: "emailNotifications",
    //           type: "checkbox",
    //           defaultValue: true,
    //           label: "Thông báo qua email",
    //         },
    //         {
    //           name: "studyReminders",
    //           type: "checkbox",
    //           defaultValue: true,
    //           label: "Nhắc nhở học tập",
    //         },
    //         {
    //           name: "achievementNotifications",
    //           type: "checkbox",
    //           defaultValue: true,
    //           label: "Thông báo thành tích",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
  timestamps: true,
};
