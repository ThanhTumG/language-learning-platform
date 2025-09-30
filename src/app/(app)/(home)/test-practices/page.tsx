import { DEFAULT_LIMIT } from "@/constants";
import { TestPracticesView } from "@/modules/test-practices/ui/views/test-practices-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.toeic.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestPracticesView />
    </HydrationBoundary>
  );
}
