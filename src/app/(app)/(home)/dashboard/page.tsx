import { DEFAULT_LIMIT } from "@/constants";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.toeicAttempts.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  void queryClient.prefetchQuery(
    trpc.progress.getBySkill.queryOptions({ skill: "ielts" })
  );
  void queryClient.prefetchQuery(
    trpc.progress.getBySkill.queryOptions({ skill: "toeic" })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />;
    </HydrationBoundary>
  );
}
