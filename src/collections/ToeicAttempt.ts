import type { CollectionConfig } from "payload";

export const ToeicAttempt: CollectionConfig = {
  slug: "toeic-attempts",
  admin: {
    useAsTitle: "attemptTitle",
    defaultColumns: [
      "user",
      "test",
      "attemptDate",
      "totalScore",
      "status",
      "createdAt",
    ],
  },
  access: {
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      // Người dùng chỉ có thể cập nhật attempts của chính họ
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        };
      }
      return false;
    },
    delete: ({ req: { user } }) => {
      // Người dùng chỉ có thể xóa attempts của chính họ
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        };
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: "test",
      type: "relationship",
      relationTo: "toeic",
      required: true,
    },
    {
      name: "attemptTitle",
      type: "text",
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Tự động tạo tiêu đề dựa trên tên test và ngày
            if (siblingData?.test && siblingData?.attemptDate) {
              const testTitle = siblingData.test?.title || "TOEIC Test";
              const date = new Date(siblingData.attemptDate).toLocaleDateString(
                "vi-VN"
              );
              siblingData.attemptTitle = `${testTitle} - ${date}`;
            }
          },
        ],
      },
    },
    {
      name: "attemptDate",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: "timeSpent",
      type: "number",
      min: 0,
    },
    {
      name: "scores",
      type: "group",
      fields: [
        {
          name: "listening",
          type: "number",
          min: 0,
          max: 495,
        },
        {
          name: "reading",
          type: "number",
          min: 0,
          max: 495,
        },
        {
          name: "total",
          type: "number",
          min: 0,
          max: 990,
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const listening = siblingData?.listening || 0;
                const reading = siblingData?.reading || 0;
                siblingData.total = listening + reading;
              },
            ],
          },
        },
      ],
    },
    {
      name: "sectionScores",
      type: "group",
      fields: [
        {
          name: "listeningDetails",
          type: "group",
          fields: [
            {
              name: "part1",
              type: "number",
              label: "Part 1 - Photos",
              min: 0,
            },
            {
              name: "part2",
              type: "number",
              label: "Part 2 - Question-Response",
              min: 0,
            },
            {
              name: "part3",
              type: "number",
              label: "Part 3 - Conversations",
              min: 0,
            },
            {
              name: "part4",
              type: "number",
              label: "Part 4 - Talks",
              min: 0,
            },
          ],
        },
        {
          name: "readingDetails",
          type: "group",
          fields: [
            {
              name: "part5",
              type: "number",
              label: "Part 5 - Incomplete Sentences",
              min: 0,
            },
            {
              name: "part6",
              type: "number",
              label: "Part 6 - Text Completion",
              min: 0,
            },
            {
              name: "part7",
              type: "number",
              label: "Part 7 - Reading Comprehension",
              min: 0,
            },
          ],
        },
      ],
    },
    {
      name: "answers",
      type: "array",
      fields: [
        {
          name: "questionNumber",
          type: "number",
          required: true,
        },
        {
          name: "section",
          type: "select",
          options: [
            { label: "Listening", value: "listening" },
            { label: "Reading", value: "reading" },
          ],
          required: true,
        },
        {
          name: "part",
          type: "number",
          min: 1,
          max: 7,
          required: true,
          label: "Part",
        },
        {
          name: "userAnswer",
          type: "text",
        },
        {
          name: "correctAnswer",
          type: "text",
        },
        {
          name: "isCorrect",
          type: "checkbox",
        },
        {
          name: "timeSpent",
          type: "number",
          min: 0,
        },
        {
          name: "difficulty",
          type: "select",
          options: [
            { label: "Easy", value: "easy" },
            { label: "Medium", value: "medium" },
            { label: "Hard", value: "hard" },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "In progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
        { label: "Abandoned", value: "abandoned" },
        { label: "Timeout", value: "timeout" },
      ],
      defaultValue: "in_progress",
    },

    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "attemptNumber",
      type: "number",
      min: 1,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "improvement",
      type: "group",
      label: "Improvement with previous attempt",
      fields: [
        {
          name: "previousAttempt",
          type: "relationship",
          relationTo: "toeic-attempts",
        },
      ],
    },
    {
      name: "analytics",
      type: "group",
      fields: [
        {
          name: "accuracyRate",
          type: "number",
          min: 0,
          max: 100,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "averageTimePerQuestion",
          type: "number",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "weakAreas",
          type: "array",
          fields: [
            {
              name: "part",
              type: "number",
              required: true,
              label: "Part",
            },
            {
              name: "accuracy",
              type: "number",
              required: true,
            },
          ],
        },
        {
          name: "strongAreas",
          type: "array",
          fields: [
            {
              name: "part",
              type: "number",
              required: true,
              label: "Part",
            },
            {
              name: "accuracy",
              type: "number",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Tự động set user từ session
        if (operation === "create" && req.user) {
          data.user = req.user.id;
        }

        // Tự động tính toán analytics
        if (data.answers && data.answers.length > 0) {
          const totalQuestions = data.answers.length;
          const correctAnswers = data.answers.filter(
            (answer: { isCorrect?: boolean }) => answer.isCorrect
          ).length;
          data.analytics = {
            ...data.analytics,
            accuracyRate: Math.round((correctAnswers / totalQuestions) * 100),
            averageTimePerQuestion: data.timeSpent
              ? Math.round((data.timeSpent * 60) / totalQuestions)
              : 0,
          };
        }
      },
    ],
  },
  timestamps: true,
};
