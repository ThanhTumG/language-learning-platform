"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { TestCard, TestCardSkeleton } from "../components/test-card";
import { Button } from "@/components/ui/button";
enum Skills {
  TOEIC = "toeic",
  IELTS = "ielts",
}
export const TestPracticesView = () => {
  const [skill, setSkill] = useState<Skills>(Skills.TOEIC);

  const trpc = useTRPC();
  const {
    data: toeicTests,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.toeic.getMany.infiniteQueryOptions(
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

  const handleChangeSkill = (skill: string) => {
    setSkill(skill as Skills);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Tests
          </h1>
          <p className="text-gray-600">
            Choose a test to practice with realistic {skill.toUpperCase()} test
            conditions
          </p>
        </div>

        <Tabs value={skill} onValueChange={handleChangeSkill}>
          <TabsList>
            <TabsTrigger value="ielts">IELTS</TabsTrigger>
            <TabsTrigger value="toeic">TOEIC</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Test list */}
      <Suspense fallback={<TestListSkeleton />}>
        <div className="space-y-4">
          {skill === Skills.TOEIC &&
            toeicTests?.pages.flatMap((page) =>
              page.docs.map((test) => (
                <TestCard
                  key={test.id}
                  id={test.id.toString()}
                  name={test.title}
                  description={test.description ?? ""}
                  totalTime={test.duration}
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
    </div>
  );
};

export const TestListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <TestCardSkeleton key={index} />
      ))}
    </div>
  );
};
