"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  Award,
  BarChart3,
  BookOpen,
  Headphones,
  Play,
  Target,
  Trophy,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { StatCard, StatCardSkeleton } from "../components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AttemptCard, AttemptCardSkeleton } from "../components/attempt-card";
import { SkillProgress } from "../components/skill-progress";

enum Skills {
  TOEIC = "toeic",
  IELTS = "ielts",
}

export const DashboardView = () => {
  const [skill, setSkill] = useState<Skills>(Skills.TOEIC);
  const trpc = useTRPC();

  const {
    data: ToeicData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.toeicAttempts.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );

  const { data: progress } = useQuery(
    trpc.progress.getBySkill.queryOptions({ skill })
  );

  const stats = useMemo(
    () => [
      {
        key: "total-test",
        title: "Total Tests",
        content: (progress?.totalTestsCompleted ?? 0).toString(),
        note: "",
        Icon: BookOpen,
      },
      {
        key: "avg-score",
        title: "Average Score",
        content: progress?.averageScore?.toString(),
        note:
          progress?.averageScore && progress?.averageScore >= 450
            ? "You are doing great!"
            : "Keep trying!",
        Icon: Award,
      },
      {
        key: "best-score",
        title: "Best Score",
        content: progress?.bestScore?.toString(),
        note: progress?.bestScore
          ? `${900 - progress?.bestScore} points to go`
          : "",
        Icon: Trophy,
      },
      {
        key: "study-streak",
        title: "Study Streak",
        content: progress?.studyStreak?.toString(),
        note: "Keep it up!",
        Icon: Target,
      },
    ],
    [
      progress?.averageScore,
      progress?.bestScore,
      progress?.studyStreak,
      progress?.totalTestsCompleted,
    ]
  );

  const toeicSkillsProgress = useMemo(
    () => [
      {
        skill: "Listening",
        color: "bg-blue-500",
        Icon: Headphones,
        current: progress?.skillsAverage?.find(
          (subSkill) => subSkill.subSkill === "listening"
        )?.averageScore,
        target: 450,
      },
      {
        skill: "Reading",
        color: "bg-green-500",
        Icon: BookOpen,
        current: progress?.skillsAverage?.find(
          (subSkill) => subSkill.subSkill === "reading"
        )?.averageScore,
        target: 450,
      },
    ],
    [progress?.skillsAverage]
  );

  const handleChangeSkill = (skill: string) => {
    setSkill(skill as Skills);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Continue your {skill.toUpperCase()} preparation journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={skill} onValueChange={handleChangeSkill}>
              <TabsList>
                <TabsTrigger value="ielts">IELTS</TabsTrigger>
                <TabsTrigger value="toeic">TOEIC</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="mr-2 h-4 w-4" />
              Start Practice
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Progress
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatCardsSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard
              key={stat.key as string}
              title={stat.title}
              content={stat.content as string}
              note={stat.note}
              Icon={stat.Icon}
            />
          ))}
        </div>
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Recent Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>
                Your latest practice test scores and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentTestSkeleton />}>
                <div className="space-y-4">
                  {ToeicData.pages.flatMap((page) =>
                    page.docs.map((attempt) => (
                      <AttemptCard
                        key={attempt.id}
                        date={attempt.createdAt}
                        name={attempt.attemptTitle as string}
                        score={attempt.scores?.total || 0}
                        type="toeic"
                      />
                    ))
                  )}
                </div>
                <div className="flex justify-center pt-8">
                  {hasNextPage && (
                    <Button
                      variant="outline"
                      disabled={isFetchingNextPage}
                      onClick={() => fetchNextPage()}
                      className="font-medium disabled:opacity-50 text-base bg-white"
                    >
                      Load more
                    </Button>
                  )}
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
              <CardDescription>
                Track your improvement across all {skill.toUpperCase()} skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {toeicSkillsProgress.map((skill, index) => (
                <SkillProgress
                  key={index}
                  skill={skill.skill}
                  color={skill.color}
                  target={skill.target}
                  current={skill.current || 0}
                  Icon={skill.Icon}
                />
              ))}
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  💡 <strong>Practice regularly:</strong> Consistent daily
                  practice for 30 minutes is more effective than cramming for
                  hours once a week.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const RecentTestSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <AttemptCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const StatCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
};
