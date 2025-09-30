import { DEFAULT_LIMIT } from "@/constants";
import { TestPracticesView } from "@/modules/test-practices/ui/views/test-practices-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ test: string }>;
}

export default async function Page({ params }: Props) {
  const { test } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.toeic.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestPracticesView testType={test} />
    </HydrationBoundary>
  );
}
