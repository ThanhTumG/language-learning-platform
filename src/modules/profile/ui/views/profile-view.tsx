"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateProfileForm } from "../components/update-profile-form";
import { ProfileSchemaType } from "@/modules/user/schemas";

export const ProfileView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.user.getInfo.queryOptions());

  const updateUser = useMutation(
    trpc.user.updateInfo.mutationOptions({
      onError: (error) => {
        console.error("Failed to update user info:", error);
        toast.error("Failed to update user info");
      },
    })
  );

  const createMedia = useMutation(trpc.media.create.mutationOptions());

  const handleUpdateProfile = async (data: ProfileSchemaType) => {
    console.log("user update data: ", data.avatar);
    try {
      const formData = new FormData();

      const timestamps = new Date().toLocaleString();
      formData.append("file", data.avatar);

      for (const [key, value] of formData.entries()) {
        console.log("key:", key); // sẽ thấy "Alt"
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/media`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.log(res.url);
      }
    } catch {
      toast.error("Error upload image");
    }

    // const {id : avatarId} = createMedia.mutate({
    //   file: data.avatar
    // })

    // updateUser.mutate({
    //   fullName: data.fullname,
    //   avatarId: avatarId,
    // });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Student information</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UpdateProfileForm
                fullname={data.fullname}
                onUpdate={handleUpdateProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>{/* <UpdatePasswordForm /> */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
