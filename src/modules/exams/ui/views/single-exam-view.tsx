"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, getExamStatus, getTimeRemaining } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Play,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  examId: string;
}

export const SingleExamView = ({ examId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.exams.getOne.queryOptions({ examId }));

  const examData = useMemo(() => {
    if (!data) return null;
    const status = getExamStatus(data.startTime, data.endTime);
    const isActive = status === "active";
    const isUpcoming = status === "upcoming";
    const isEnded = status === "ended";
    return { ...data, status, isActive, isUpcoming, isEnded };
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" asChild>
        <Link href={"/exams"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start my-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl text-primary">{data.title}</h1>
            {examData?.isActive && (
              <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {examData?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Test Type</p>
                  <p className="text-lg">{"toeic".toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p className="text-lg">Full Test</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Test Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{examData?.test.duration ?? 0}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">
                      {examData?.test.totalQuestions ?? 0} questions
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p>{formatDate(examData?.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p>{formatDate(examData?.endTime)}</p>
                  </div>
                </div>
                {examData?.isActive && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-orange-700">
                        <span className="font-semibold">
                          {getTimeRemaining(examData?.endTime)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Test Structure
              </CardTitle>
              <CardDescription>
                Breakdown of sections and number of questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {examData?.test.parts.map((part, index) => {
                  if (!part || typeof part === "number") return null;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">Part {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {part.name}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {part.questionCount}{" "}
                        {part.questionCount === 1 ? "question" : "questions"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Start Exam Card */}
          <Card
            className={examData?.isActive ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <CardTitle className="text-center">Ready to compete?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-2xl">
                    {examData?.numberOfParticipants ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">participants</p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!examData?.isActive}
              >
                {examData?.isActive && (
                  <Link
                    href={`/exams/${examId}/start`}
                    className="w-full flex items-center justify-center"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Exam Now
                  </Link>
                )}
                {examData?.isUpcoming && (
                  <>
                    <Clock className="mr-2 h-5 w-5" />
                    Coming Soon
                  </>
                )}
                {examData?.isEnded && (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Exam Ended
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>Find a quiet place to take the exam</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>Ensure stable internet connection</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>Have headphones ready for listening sections</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p>You can retake to improve your score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
