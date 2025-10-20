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
import { formatDate, getTimeRemaining } from "@/lib/utils";
import { ExamsGetManyOutput } from "@/modules/exams/type";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Play,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export const ExamsView = () => {
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "ended">(
    "active"
  );

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.exams.getMany.queryOptions());

  const getExamStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return "upcoming";
    if (now > endDate) return "ended";
    return "active";
  };

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
    <div className="max-w-6xl container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Competition Exams
          </h1>
          <p className="text-muted-foreground">
            Compete with others and climb the leaderboard
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Exams</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Starting soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Exams</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{data?.length}</div>
            <p className="text-xs text-muted-foreground">All exams</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
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
            const isActive = status === "active";
            const isUpcoming = status === "upcoming";
            const isEnded = status === "ended";

            return (
              <Card
                key={exam.id}
                className={`${
                  isActive ? "border-primary shadow-lg" : ""
                } transition-all hover:shadow-md`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {exam.title}
                        {isActive && (
                          <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {exam.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        isActive ? "default" : isEnded ? "secondary" : "outline"
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Exam Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm">
                          {exam.test.title.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="text-sm">{exam.test.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Starts:</span>
                      <span>{formatDate(exam.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ends:</span>
                      <span>{formatDate(exam.endTime)}</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {exam.numberOfParticipants ?? 0} participants
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-sm text-orange-500">
                        {getTimeRemaining(exam.endTime)}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    disabled={!isActive}
                    // onClick={() => onStartExam(exam)}
                  >
                    {isActive && (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Exam
                      </>
                    )}
                    {isUpcoming && (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Coming Soon
                      </>
                    )}
                    {isEnded && (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Ended
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
