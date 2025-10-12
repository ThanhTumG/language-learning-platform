import { DEFAULT_LIMIT } from "@/constants";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page() {
  const queryClient = getQueryClient();

  const { user } = await caller.auth.session();
  if (!user) {
    redirect("/sign-in");
  }

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
