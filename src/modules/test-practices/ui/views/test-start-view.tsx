"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ScrollText,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudioPlayer } from "../components/audio-player";
import { ToeicAttemptsQuestionItemOutput } from "@/modules/toeic-attempts/type";
import { QuestionItemCard } from "../components/question-item-card";

interface Props {
  testType: string;
  testId: string;
}

interface testDataType {
  id: number;
  attemptId: number;
  audio?: string | undefined;
  title: string;
  description?: string | null;
  duration: number;
  totalQuestions: number;
  difficulty?: ("easy" | "medium" | "hard") | null;
  parts?: formattedTestPartsType[];
}

interface formattedTestPartsType {
  partNumber: number;
  questionCount: number;
  questionItem: number[];
}

function CountdownDisplay({ endAt }: { endAt: number }) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1); // trigger re-render
      if (Date.now() >= endAt) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  const remainingSec = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  return (
    <div className="text-2xl font-bold text-red-600">
      {formatTime(remainingSec)}
    </div>
  );
}

export const TestStartView = ({ testId }: Props) => {
  const [testData, setTestData] = useState<testDataType | null>(null);
  const [questionItemList, setQuestionItemList] = useState<
    ToeicAttemptsQuestionItemOutput[]
  >([]);
  const [selectedQNItem, setSelectedQNItem] = useState<number>(1);
  const [selectedQN, setSelectedQN] = useState<number>(1);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [endAt, setEndAt] = useState<number | null>(null);

  // const isToeic = testType === "toeic";

  const trpc = useTRPC();
  const startTestMutation = useMutation({
    ...trpc.toeicAttempts.create.mutationOptions({
      onSuccess: (data) => {
        const formattedTestParts =
          data?.parts?.map((part, index) => ({
            partNumber: index + 1,
            questionCount: part.questionCount,
            questionItem:
              part.questionItems?.flatMap(
                (qi) => qi.questions?.map((q) => q.questionNumber) ?? 0
              ) ?? [],
          })) ?? [];

        const questionItems =
          data.parts?.flatMap((part) => part.questionItems ?? []) ?? [];

        setQuestionItemList(questionItems);

        setTestData({
          id: data.id,
          attemptId: data.attemptId,
          audio: data.audioFile?.url ?? undefined,
          duration: data.duration,
          title: data.title,
          totalQuestions: data.totalQuestions,
          description: data.description,
          difficulty: data.difficulty,
          parts: formattedTestParts,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  });

  const updateTestMutation = useMutation(
    trpc.toeicAttempts.update.mutationOptions({
      onError: (error) => {
        console.error(error);
      },
    })
  );

  const updateAnswer = (questionId: number, answer: number) => {
    if (questionId === null) return;
    setAnswers({ ...answers, [questionId]: answer });
  };

  const gotoQuestion = (questionNumber: number) => {
    const questionItem = questionItemList.find((item) =>
      item.questions?.some((q) => q.questionNumber === questionNumber)
    );
    if (!questionItem) return;
    const qnItemIndex = questionItemList.indexOf(questionItem);
    const qnIndex = questionItem.questions
      ? questionItem.questions[questionItem.questions.length - 1].questionNumber
      : 0;
    if (qnItemIndex === -1 || qnIndex === -1) return;
    setSelectedQN(qnIndex);
    setSelectedQNItem(qnItemIndex + 1);
  };

  const handleFinishTest = () => {
    if (testData) {
      updateTestMutation.mutate({
        attemptId: testData?.attemptId,
        answers: answers,
      });
    }
  };

  const attemptCreatedRef = React.useRef(false);

  useEffect(() => {
    if (!attemptCreatedRef.current) {
      startTestMutation.mutate({ testId });
      attemptCreatedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      {/* Test Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="mx-auto px-10 py-4 max-w-screen-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                <ScrollText className="w-8 h-8 text-gray-800" />
              </div>
              <div>
                <h1 className="font-semibold">{testData?.title}</h1>
                <p className="text-sm text-gray-600 capitalize">
                  {testData?.difficulty} difficulty
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                {endAt && <CountdownDisplay endAt={endAt} />}
                <p className="text-xs text-gray-500">Time Remaining</p>
              </div>
              <Button variant="destructive" onClick={() => {}}>
                <Square className="mr-2 h-4 w-4" />
                Finish Test
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <Progress
              value={
                testData?.totalQuestions && testData?.totalQuestions > 0
                  ? (selectedQN / testData?.totalQuestions) * 100
                  : 0
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="mx-auto px-4 py-8 max-w-screen-2xl">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            {/* Audio */}
            <AudioPlayer
              audioSrc={testData?.audio}
              onReady={() =>
                setEndAt(Date.now() + (testData?.duration ?? 0) * 60 * 1000)
              }
            />
            {/* Question */}
            {questionItemList.length > 0 && endAt !== null && (
              <QuestionItemCard
                questionItem={questionItemList[selectedQNItem - 1]}
                updateAnswer={updateAnswer}
                answers={answers}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                disabled={selectedQNItem === 1}
                onClick={() =>
                  gotoQuestion(
                    questionItemList[
                      selectedQNItem > 1 ? selectedQNItem - 2 : 0
                    ]?.questions?.[0]?.questionNumber ?? 1
                  )
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {
                <div className="text-sm text-gray-600">
                  Question {selectedQN} of {testData?.totalQuestions ?? 0}
                </div>
              }
              <Button
                onClick={() => {
                  if (selectedQNItem < questionItemList.length) {
                    gotoQuestion(
                      questionItemList[selectedQNItem]?.questions?.[0]
                        ?.questionNumber ?? 1
                    );
                  } else {
                    handleFinishTest();
                  }
                }}
              >
                {selectedQNItem < questionItemList.length ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finish Test
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Questions navigation */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>
                  Click on any question to navigate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2">
                  {testData?.parts?.map((part) => (
                    <div key={part.partNumber} className="col-span-5">
                      <h3 className="font-semibold mb-2">
                        Part {part.partNumber}
                      </h3>
                      <div className="grid grid-cols-5 gap-2">
                        {part.questionItem.map((qn) => {
                          const isAnswered = answers[qn] !== undefined;
                          return (
                            <Button
                              key={qn}
                              variant={isAnswered ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => gotoQuestion(qn)}
                              className={`relative ${
                                isAnswered
                                  ? "bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border-cyan-300"
                                  : ""
                              }`}
                            >
                              {qn}
                              {isAnswered && (
                                <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-cyan-600 bg-white rounded-full" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
