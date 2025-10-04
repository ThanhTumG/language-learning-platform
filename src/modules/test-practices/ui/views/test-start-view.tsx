"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { QuestionType } from "@/modules/toeic-attempts/type";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudioPlayer } from "../components/audio-player";

interface Props {
  testType: string;
  testId: string;
}

interface testDataType {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  totalQuestions: number;
  difficulty?: ("easy" | "medium" | "hard") | null;
  audio?: string;
}

function CountdownDisplay({ initial }: { initial: number }) {
  const [, setTick] = React.useState(0);
  const time = React.useRef(initial);

  React.useEffect(() => {
    const interval = setInterval(() => {
      time.current -= 1;
      setTick((t) => t + 1); // chỉ trigger re-render phần nhỏ này
      if (time.current <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-bold text-red-600">
      {formatTime(time.current)}
    </div>
  );
}

export const TestStartView = ({ testType, testId }: Props) => {
  const [testData, setTestData] = useState<testDataType | null>(null);
  const [questionList, setQuestionList] = useState<QuestionType[]>([]);
  const [selectedQN, setSelectedQN] = useState<QuestionType | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const isToeic = testType === "toeic";

  const trpc = useTRPC();
  const startTestMutation = useMutation({
    ...trpc.toeicAttempts.create.mutationOptions({
      onSuccess: (data) => {
        if (isToeic) {
          const listeningQN: QuestionType[] =
            data.listeningSection.parts
              ?.flatMap((part) =>
                (part?.questions ?? []).map((q) =>
                  q ? { ...q, type: "listen" } : undefined
                )
              )
              .filter((q): q is QuestionType => q !== undefined) ?? [];

          const readingQN: QuestionType[] =
            data.readingSection.parts
              ?.flatMap((part) =>
                (part.passages ?? []).flatMap((passage) =>
                  (passage.questions ?? []).map((q) =>
                    q ? ({ ...q, type: "read" } as QuestionType) : undefined
                  )
                )
              )
              .filter((q): q is QuestionType => q !== null) ?? [];

          const questions = [...listeningQN, ...readingQN];

          if (questions.length > 0) {
            setSelectedQN(questions[0]);
          }
          setQuestionList(questions);
        }

        setTestData({
          id: data.id,
          duration: data.duration,
          title: data.title,
          totalQuestions: data.totalQuestions,
          description: data.description,
          difficulty: data.difficulty,
          audio: data.listeningSection.audioFile?.url ?? undefined,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  });

  const updateAnswer = (questionId: number | null, answer: string) => {
    if (questionId === null) return;
    setAnswers({ ...answers, [questionId]: answer });
  };

  const gotoQuestion = (questionNumber: number) => {
    setSelectedQN(
      questionList.find((q) => q.questionNumber === questionNumber) || null
    );
  };

  useEffect(() => {
    if (isToeic) {
      startTestMutation.mutate({ testId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, isToeic]);

  const memoAudioSrc = useMemo(() => testData?.audio, [testData?.audio]);

  return (
    <div className="min-h-screen">
      {/* Test Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                <ScrollText className="w-8 h-8 text-gray-800" />
              </div>
              <div>
                <h1 className="font-bold">{testData?.title}</h1>
                <p className="text-sm text-gray-600 capitalize">
                  {testData?.difficulty} difficulty
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                {testData?.duration && (
                  <CountdownDisplay initial={testData?.duration * 60} />
                )}
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
                questionList.length > 0
                  ? ((selectedQN?.questionNumber ?? 0) / questionList.length) *
                    100
                  : 0
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Audio */}
            <AudioPlayer audioSrc={memoAudioSrc} />
            <Card>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <Label className="font-medium">
                    Question {selectedQN?.questionNumber}
                  </Label>
                  <p className="text-gray-700 mb-4">
                    {selectedQN?.questionText}
                  </p>
                  <RadioGroup
                    value={answers[selectedQN?.questionNumber ?? -1] || ""}
                    onValueChange={(value) =>
                      updateAnswer(selectedQN?.questionNumber ?? null, value)
                    }
                  >
                    {selectedQN?.options?.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-3"
                      >
                        <RadioGroupItem
                          value={`${index}`}
                          id={`${index + 1}`}
                        />
                        <Label htmlFor={`${index + 1}`}>{option.option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedQN(
                    questionList[
                      Math.max((selectedQN?.questionNumber ?? 0) - 2, 0)
                    ]
                  )
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-600">
                Question {selectedQN?.questionNumber ?? 0} of{" "}
                {questionList.length}
              </div>
              <Button
                onClick={() => {
                  if ((selectedQN?.questionNumber ?? 0) < questionList.length) {
                    setSelectedQN(
                      questionList[selectedQN?.questionNumber ?? 0]
                    );
                  } else {
                    // handleFinishTest();
                  }
                }}
              >
                {(selectedQN?.questionNumber ?? 0) < questionList.length ? (
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

          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>
                  Click on any question to navigate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-16rem)] overflow-y-auto p-2">
                  {Array.from({ length: questionList.length }, (_, i) => {
                    const isAnswered =
                      answers[i + 1] !== undefined && answers[i + 1] !== "";
                    const isCurrent =
                      i === (selectedQN?.questionNumber ?? 1) - 1;
                    return (
                      <Button
                        key={i}
                        variant={
                          isCurrent
                            ? "default"
                            : isAnswered
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => gotoQuestion(i + 1)}
                        className={`relative ${
                          isCurrent
                            ? "ring-2 ring-offset-2 ring-primary"
                            : isAnswered
                            ? "bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border-cyan-300"
                            : ""
                        }`}
                      >
                        {i + 1}
                        {isAnswered && !isCurrent && (
                          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-cyan-600 bg-white rounded-full" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
