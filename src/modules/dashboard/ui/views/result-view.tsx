"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, evaluateSpeed, formatDuration } from "@/lib/utils";
import { Part } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QuestionReview } from "../components/question-review";
import { Button } from "@/components/ui/button";

interface Props {
  test: string;
  attemptId: string;
}

interface AccuracyPartsType {
  name: string;
  accuracy: number;
}

export const ResultView = ({ test, attemptId }: Props) => {
  const [reviewQNFilter, setReviewQNFilter] = useState<
    "all" | "correct" | "incorrect" | "unanswered"
  >("all");
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.toeicAttempts.getOne.queryOptions({
      attemptId: attemptId,
    })
  );

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    return "D";
  };

  const scorePercentage = useMemo(() => {
    const maxScore = data.test?.scoring.totalMaxScore;
    const totalScore = data.scores?.total ?? 0;
    if (maxScore === undefined) return 0;
    return parseFloat(((totalScore / maxScore) * 100).toFixed(2));
  }, [data.scores?.total, data.test?.scoring.totalMaxScore]);

  const accuracyParts: AccuracyPartsType[] = useMemo(
    () =>
      data.parts?.map((part, index) => ({
        name: `Part ${index + 1}`,
        accuracy: part.accuracyRate ?? 0,
      })) ?? [],
    [data.parts]
  );

  const pieData = useMemo(() => {
    if (data.test?.totalQuestions === undefined) return [];

    const total = data.test?.totalQuestions;
    const correct = data.analytics?.correctAnswer ?? 0;
    const user = data.analytics?.userAnswer ?? 0;
    const incorrect = user - correct;

    return [
      {
        name: "Correct",
        value: parseFloat(((correct / total) * 100).toFixed(1)),
        color: "#10b981",
      },
      {
        name: "Incorrect",
        value: parseFloat(((incorrect / total) * 100).toFixed(1)),
        color: "#ef4444",
      },
      {
        name: "Unanswered",
        value: parseFloat((((total - user) / total) * 100).toFixed(1)),
        color: "#94a3b8",
      },
    ];
  }, [
    data.analytics?.correctAnswer,
    data.analytics?.userAnswer,
    data.test?.totalQuestions,
  ]);

  const reviewQuestions = useMemo(() => {
    const testParts = data.test?.parts as Part[] | null | undefined;
    const answers = data.test?.answers;
    const userParts = data.parts ?? [];
    const userAnswers = userParts.flatMap((p) => p.questions ?? []);

    if (testParts && answers && userAnswers) {
      const reviewQN = testParts.flatMap((part) => {
        const questionItems = part.questionItems ?? [];
        return questionItems.flatMap((qs) => {
          const questions = qs.questions ?? [];
          return questions.map((q) => {
            const userAnswer = userAnswers.find(
              (ua) => ua.question.questionNumber === q.questionNumber
            );
            return {
              ...q,
              userAnswer: userAnswer?.question.userAnswer,
              correctAnswer: userAnswer?.question.correctAnswer,
            };
          });
        });
      });
      let filterReview = [];
      if (reviewQNFilter === "correct") {
        filterReview = reviewQN.filter(
          (q) =>
            q.correctAnswer && q.userAnswer && q.correctAnswer === q.userAnswer
        );
      } else if (reviewQNFilter === "incorrect") {
        filterReview = reviewQN.filter(
          (q) =>
            q.correctAnswer && q.userAnswer && q.correctAnswer !== q.userAnswer
        );
      } else if (reviewQNFilter === "unanswered") {
        filterReview = reviewQN.filter((q) => !q.userAnswer);
      } else {
        filterReview = reviewQN;
      }
      return filterReview;
    }
    return [];
  }, [data.parts, data.test?.answers, data.test?.parts, reviewQNFilter]);

  return (
    <div className="max-w-6xl container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
          <div>
            <h1 className="text-3xl text-primary">Test Result</h1>
            <p className="text-muted-foreground">{data.attemptTitle}</p>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Target className="h-5 w-5" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl mb-2 ${getScoreColor(scorePercentage)}`}>
              {test === "toeic"
                ? data.scores?.total ?? 0
                : data.scores?.total?.toFixed(1) ?? 0}
              <span className="text-lg text-muted-foreground">
                /{data.test?.scoring.totalMaxScore ?? 0}
              </span>
            </div>
            <Badge variant="secondary" className="text-lg">
              Grade {getGrade(scorePercentage)}
            </Badge>
            <Progress value={scorePercentage} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl text-green-600 mb-2">
              {data.analytics?.accuracyRate ?? 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Answer {data.analytics?.userAnswer} out of{" "}
              {data.test?.totalQuestions ?? 0} questions
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Correct: {data.analytics?.correctAnswer}
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  Incorrect:{" "}
                  {(data.analytics?.userAnswer ?? 0) -
                    (data.analytics?.correctAnswer ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              Time Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl text-blue-600 mb-2">
              {formatDuration(Math.ceil((data.timeSpent ?? 0) * 60))}
            </div>
            <p className="text-sm text-muted-foreground">
              Average:{" "}
              {formatDuration(data.analytics?.averageTimePerQuestion ?? 0)} per
              question
            </p>
            <div className="mt-4">
              <Badge variant="outline">
                Efficiency:{" "}
                {evaluateSpeed(
                  data.analytics?.averageTimePerQuestion ?? 0,
                  "toeic"
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance by Question Type
            </CardTitle>
            <CardDescription>
              Your accuracy across different question categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={accuracyParts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Answer Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Distribution</CardTitle>
            <CardDescription>Breakdown of your responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Review - For listening and reading sections */}
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <CardTitle>Question Review</CardTitle>
            </div>
            <CardDescription>
              Review all questions and your answers (listening & reading
              section)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setReviewQNFilter((prev) =>
                  prev === "correct" ? "all" : "correct"
                )
              }
              className={cn(
                "text-base",
                reviewQNFilter === "correct"
                  ? "border-1 bg-accent"
                  : "border-0 shadow-none hover:border-1"
              )}
            >
              Correct
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setReviewQNFilter((prev) =>
                  prev === "incorrect" ? "all" : "incorrect"
                )
              }
              className={cn(
                "text-base",
                reviewQNFilter === "incorrect"
                  ? "border-1 bg-accent"
                  : "border-0 shadow-none hover:border-1"
              )}
            >
              Incorrect
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setReviewQNFilter((prev) =>
                  prev === "unanswered" ? "all" : "unanswered"
                )
              }
              className={cn(
                "text-base",
                reviewQNFilter === "unanswered"
                  ? "border-1 bg-accent"
                  : "border-0 shadow-none hover:border-1"
              )}
            >
              Unanswered
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewQuestions.map((rq) => (
              <QuestionReview
                key={rq.questionNumber}
                qnNumber={rq.questionNumber}
                qnText={rq.questionText}
                options={rq.options}
                userAnswer={rq.userAnswer}
                correctAnswer={rq.correctAnswer}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
