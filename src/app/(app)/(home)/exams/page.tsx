import { ExamsView } from "@/modules/exams/ui/components/views/exams-view";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page() {
  const queryClient = getQueryClient();
  const { user } = await caller.auth.session();
  if (!user) {
    redirect("/sign-in");
  }

  void queryClient.prefetchQuery(trpc.exams.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExamsView />
    </HydrationBoundary>
  );
}
