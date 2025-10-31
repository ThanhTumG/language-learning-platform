import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/modules/user/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  onUpdate: (data: ChangePasswordSchemaType) => void;
  isPending?: boolean;
}

export const ChangePasswordForm = ({ onUpdate, isPending }: Props) => {
  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPw: "",
      confirmPw: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onUpdate)} className="w-full space-y-6">
        {/* New password */}
        <FormField
          control={form.control}
          name="newPw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input placeholder="New password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="confirmPw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Confirm change password
        </Button>
      </form>
    </Form>
  );
};
