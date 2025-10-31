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
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateProfileForm } from "../components/update-profile-form";
import {
  ChangePasswordSchemaType,
  ProfileSchemaType,
} from "@/modules/user/schemas";
import { fileToBase64 } from "@/modules/media/utils";
import { ChangePasswordForm } from "../components/change-password-form";

export const ProfileView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.user.getInfo.queryOptions());

  const queryClient = useQueryClient();

  const updateUser = useMutation(
    trpc.user.updateInfo.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryOptions());
        toast.success("User profile has been updated");
      },
      onError: (error) => {
        console.error("Failed to update user info:", error);
        toast.error("Failed to update user info");
      },
    })
  );

  const changePassword = useMutation(
    trpc.auth.changePassword.mutationOptions({
      onSuccess: () => {
        toast.success("Your password has been updated");
      },
      onError: (error) => {
        console.error("Failed to change password:", error);
        toast.error("Failed to change password");
      },
    })
  );

  const handleUpdateProfile = async (data: ProfileSchemaType) => {
    try {
      const imageBase64 = data.avatar
        ? await fileToBase64(data.avatar)
        : undefined;

      updateUser.mutate({
        fullName: data.fullname,
        imageBase64,
        mimeType: data.avatar?.type,
        fileName: data.avatar?.name,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error upload file");
    }
  };

  const handleChangePassword = async (data: ChangePasswordSchemaType) => {
    console.log("data", data);
    changePassword.mutate(data);
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
                isPending={updateUser.isPending}
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
            <CardContent className="space-y-6">
              <ChangePasswordForm
                onUpdate={handleChangePassword}
                isPending={changePassword.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
