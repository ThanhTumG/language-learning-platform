import { SingleExamView } from "@/modules/exams/ui/views/single-exam-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{
    examId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { examId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.exams.getOne.queryOptions({
      examId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleExamView examId={examId} />
    </HydrationBoundary>
  );
}
