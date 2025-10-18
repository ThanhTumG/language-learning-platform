"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ExamsView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.exams.getMany.queryOptions());

  return <>{JSON.stringify(data, null, 2)}</>;
};
