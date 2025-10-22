import { ExamsView } from "@/modules/exams/ui/views/exams-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.exams.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading exams...</div>}>
        <ExamsView />
      </Suspense>
    </HydrationBoundary>
  );
}
