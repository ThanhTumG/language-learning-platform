"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { TestCard, TestCardSkeleton } from "../components/test-card";
import { Button } from "@/components/ui/button";
interface Props {
  testType: string;
}

export const TestPracticesView = ({ testType }: Props) => {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Tests
          </h1>
          <p className="text-gray-600">
            Choose a practice test to view details and start your preparation
          </p>
        </div>
      </div>

      {/* Test list */}
      <Suspense fallback={<TestListSkeleton />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testType === "toeic" &&
            toeicTests?.pages.flatMap((page) =>
              page.docs.map((test) => (
                <TestCard
                  key={test.id}
                  id={test.id.toString()}
                  name={test.title}
                  description={test.description ?? ""}
                  totalTime={test.duration}
                  type="toeic"
                  difficulty={test.difficulty ?? "medium"}
                  totalQuestions={test.totalQuestions}
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <TestCardSkeleton key={index} />
      ))}
    </div>
  );
};
