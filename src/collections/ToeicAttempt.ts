import { ScoreByPartType } from "@/modules/toeic-attempts/type";
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
        },
        {
          name: "reading",
          type: "number",
        },
        {
          name: "total",
          type: "number",
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
      name: "parts",
      type: "array",
      fields: [
        {
          name: "accuracyRate",
          type: "number",
        },
        {
          name: "questions",
          type: "array",
          fields: [
            {
              name: "question",
              type: "group",
              fields: [
                {
                  name: "questionNumber",
                  type: "number",
                  required: true,
                },
                {
                  name: "userAnswer",
                  label: "User answer",
                  type: "number",
                },
                {
                  name: "correctAnswer",
                  label: "Correct answer",
                  type: "number",
                },
              ],
            },
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
        { name: "userAnswer", type: "number", admin: { readOnly: true } },
        { name: "correctAnswer", type: "number", admin: { readOnly: true } },
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
        if (operation === "create" && req.user) {
          data.user = req.user.id;
        }

        const scoreByPart: ScoreByPartType = data.parts;
        if (scoreByPart && scoreByPart.length > 0) {
          const totalQuestions = scoreByPart.reduce(
            (prev, curr) =>
              curr?.questions ? prev + curr.questions.length : prev,
            0
          );
          const correctAnswers = scoreByPart.reduce((prev, curr) => {
            const partScore =
              curr?.questions?.reduce((p, c) => {
                const userAnswer = c?.question?.userAnswer;
                const correctAnswer = c?.question?.correctAnswer;
                if (userAnswer && correctAnswer && userAnswer === correctAnswer)
                  return p + 1;
                return p;
              }, 0) ?? 0;
            return prev + partScore;
          }, 0);

          console.log(
            "Accuracy Rate",
            Math.round((correctAnswers / totalQuestions) * 100)
          );
          data.analytics = {
            ...data.analytics,
            userAnswer: totalQuestions,
            correctAnswer: correctAnswers,
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
