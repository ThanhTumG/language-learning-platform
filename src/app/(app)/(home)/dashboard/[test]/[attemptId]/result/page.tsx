import { ResultView } from "@/modules/dashboard/ui/views/result-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{
    test: string;
    attemptId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { test, attemptId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.toeicAttempts.getOne.queryOptions({
      attemptId: attemptId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultView test={test} attemptId={attemptId} />;
    </HydrationBoundary>
  );
}
