"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/modules/dashboard/ui/components/stat-card";
import { ExamsGetManyOutput } from "@/modules/exams/type";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Flame, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { ExamCard } from "../components/exam-card";
import { getExamStatus } from "@/lib/utils";

export const ExamsView = () => {
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "ended">(
    "active"
  );

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.exams.getMany.queryOptions());

  const filteredExams: ExamsGetManyOutput = useMemo(() => {
    if (typeof data !== "object") return [];
    return data.filter((exam) => {
      if (filter === "all") return true;
      if (!exam) return false;
      const status = getExamStatus(exam.startTime, exam.endTime);
      return status === filter;
    });
  }, [data, filter]);

  const activeCount = useMemo(() => {
    if (typeof data !== "object") return 0;
    return data.filter(
      (exam) => exam && getExamStatus(exam.startTime, exam.endTime) === "active"
    ).length;
  }, [data]);

  const upcomingCount = useMemo(() => {
    if (typeof data !== "object") return 0;
    return data.filter(
      (exam) =>
        exam && getExamStatus(exam.startTime, exam.endTime) === "upcoming"
    ).length;
  }, [data]);

  return (
    <div className="max-w-6xl container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Competition Exams</h1>
        <p className="text-gray-600">
          Compete with others and climb the leaderboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Exams"
          Icon={Trophy}
          content={data?.length.toString()}
          note="All exams"
        />
        <StatCard
          title="Active Exams"
          Icon={Flame}
          content={activeCount.toString()}
          note="Available now"
        />
        <StatCard
          title="Upcoming"
          Icon={Calendar}
          content={upcomingCount.toString()}
          note="Starting soon"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b mb-8">
        {(["all", "active", "upcoming", "ended"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filter === tab
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Exams List */}
      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === "all"
                ? "No exams available yet"
                : `No ${filter} exams at the moment`}
            </p>
          </CardContent>
        </Card>
      )}

      {filteredExams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => {
            if (!exam) return null;
            const status = getExamStatus(exam.startTime, exam.endTime);

            return (
              <ExamCard
                key={exam.id}
                id={exam.id}
                status={status}
                title={exam.title}
                description={exam.description ?? ""}
                testTitle={exam.test.title}
                testDuration={exam.test.duration}
                startTime={exam.startTime}
                endTime={exam.endTime}
                numOfParticipants={exam.participant?.length ?? 0}
                testType={"toeic"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
