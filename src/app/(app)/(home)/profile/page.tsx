import { ProfileView } from "@/modules/profile/ui/views/profile-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.user.getInfo.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfileView />
      </Suspense>
    </HydrationBoundary>
  );
}
