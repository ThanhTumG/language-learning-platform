import type { CollectionConfig } from "payload";

export const ToeicAttempt: CollectionConfig = {
  slug: "toeic-attempts",
  admin: {
    useAsTitle: "attemptTitle",
    defaultColumns: ["user", "test", "score>total", "status", "createdAt"],
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
      required: true,
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
    // afterChange: [
    //   async ({ req, doc, operation }) => {
    //     try {
    //       if (!req.user) return;
    //       if (operation !== "create" && operation !== "update") return;

    //       const payload = req.payload;
    //       const userId = req.user.id;
    //       const skill = "toeic";

    //       // Lấy progress hiện tại của skill
    //       const existing = await payload.find({
    //         collection: "progress",
    //         limit: 1,
    //         where: {
    //           and: [{ user: { equals: userId } }, { skill: { equals: skill } }],
    //         },
    //       });

    //       const now = new Date();
    //       const isStudyToday = true;

    //       const baseUpdate: {
    //         lastStudyDate: string;
    //         bestScore?: number;
    //         totalTestsCompleted?: number;
    //         averageScore?: number;
    //         studyStreak?: number;
    //       } = {
    //         lastStudyDate: now.toISOString(),
    //       };

    //       if (doc.scores?.total != null) {
    //         baseUpdate.bestScore = Math.max(
    //           Number(existing.docs?.[0]?.bestScore || 0),
    //           Number(doc.scores.total)
    //         );
    //       }

    //       // Tăng tổng số bài test hoàn thành nếu status = completed
    //       if (doc.status === "completed") {
    //         baseUpdate.totalTestsCompleted = Number(
    //           (existing.docs?.[0]?.totalTestsCompleted || 0) + 1
    //         );
    //       }

    //       // Tính averageScore đơn giản theo công thức gộp (có thể cải tiến sau)
    //       if (doc.scores?.total != null) {
    //         const prevAvg = Number(existing.docs?.[0]?.averageScore || 0);
    //         const prevCount = Number(
    //           existing.docs?.[0]?.totalTestsCompleted || 0
    //         );
    //         const newCount =
    //           doc.status === "completed" ? prevCount + 1 : prevCount;
    //         const newAvg =
    //           newCount > 0
    //             ? Math.round(
    //                 (prevAvg * prevCount + Number(doc.scores.total)) / newCount
    //               )
    //             : Number(doc.scores.total);
    //         baseUpdate.averageScore = newAvg;
    //       }

    //       // Cập nhật streak nếu học ngày mới
    //       if (isStudyToday) {
    //         const prevDateStr = existing.docs?.[0]?.lastStudyDate as
    //           | string
    //           | undefined;
    //         const prevDate = prevDateStr ? new Date(prevDateStr) : undefined;
    //         const diffDays = prevDate
    //           ? Math.floor(
    //               (now.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    //             )
    //           : undefined;
    //         let newStreak = Number(existing.docs?.[0]?.studyStreak || 0);
    //         if (diffDays === undefined) {
    //           newStreak = 1;
    //         } else if (diffDays === 0) {
    //           // cùng ngày, giữ nguyên
    //         } else if (diffDays === 1) {
    //           newStreak += 1;
    //         } else if (diffDays > 1) {
    //           newStreak = 1;
    //         }
    //         baseUpdate.studyStreak = newStreak;
    //       }

    //       if (existing.docs && existing.docs.length > 0) {
    //         await payload.update({
    //           collection: "progress",
    //           id: (existing.docs[0] as unknown as { id: number | string }).id,
    //           data: baseUpdate,
    //         });
    //       } else {
    //         await payload.create({
    //           collection: "progress",
    //           data: {
    //             user: userId,
    //             skill,
    //             studyStreak: baseUpdate.studyStreak ?? 1,
    //             lastStudyDate: baseUpdate.lastStudyDate,
    //             totalTestsCompleted:
    //               baseUpdate.totalTestsCompleted ??
    //               (doc.status === "completed" ? 1 : 0),
    //             averageScore:
    //               baseUpdate.averageScore ?? doc.scores?.total ?? undefined,
    //             bestScore:
    //               baseUpdate.bestScore ?? doc.scores?.total ?? undefined,
    //           },
    //         });
    //       }
    //     } catch (e) {
    //       // bỏ qua lỗi phụ
    //     }
    //   },
    // ],
  },
  timestamps: true,
};
