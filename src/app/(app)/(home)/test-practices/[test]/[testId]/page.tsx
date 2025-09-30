import { TestView } from "@/modules/test-practices/ui/views/test-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{
    test: string;
    testId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { test, testId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.toeic.getOne.queryOptions({
      testId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestView testType={test} testId={testId} />
    </HydrationBoundary>
  );
}
