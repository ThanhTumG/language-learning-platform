"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const DashboardView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseInfiniteQuery(
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

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
