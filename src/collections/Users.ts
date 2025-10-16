import { isSuperAdmin, isTeacher } from "@/lib/utils";
import type {
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
  Where,
} from "payload";

/**
 * Hook to clean up related data after a user is deleted
 */
const cleanupRelatedUserData: CollectionAfterDeleteHook = async ({
  req,
  id,
}) => {
  const { payload } = req;

  try {
    // 1. Delete 'Progress' related to this user
    await payload.delete({
      collection: "progress",
      overrideAccess: true,
      where: {
        user: {
          equals: id,
        },
      },
    });
    payload.logger.info(`Cleaned up progress for deleted user ${id}`);

    // 2. Delete all 'ToeicAttempt' related to this user
    await payload.delete({
      collection: "toeic-attempts",
      overrideAccess: true,
      where: {
        user: {
          equals: id,
        },
      },
    });
    payload.logger.info(`Cleaned up toeic-attempts for deleted user ${id}`);

    // 3. Delete all class owned by this user (field 'user' is required)
    await payload.delete({
      collection: "classes",
      overrideAccess: true,
      where: {
        user: {
          equals: id,
        },
      },
    });
    payload.logger.info(`Deleted classes owned by user ${id}`);
  } catch (error: unknown) {
    payload.logger.error(
      `Error in cleanupRelatedUserData hook for user ${id}: ${error}`
    );
  }
};

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "fullname", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (isSuperAdmin(user)) return true;
      if (user) {
        const where: Where = {
          or: [
            { "class.user": { equals: user.id } },
            { email: { equals: user.email } },
          ],
        };
        return where;
      }
      return false;
    },
    create: ({ req }) => isSuperAdmin(req.user) || isTeacher(req.user),
    // delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user) || isTeacher(req.user)) return true;
      return req.user?.id === id;
    },
    admin({ req }) {
      if (!req.user) {
        return false;
      }
      const { roles } = req.user;
      if (roles?.includes("super-admin") || roles?.includes("business"))
        return true;

      return false;
    },
  },
  hooks: {
    beforeDelete: [
      (async ({ req, id }) => {
        const { payload } = req;

        try {
          await payload.delete({
            collection: "progress",
            overrideAccess: true,
            where: { user: { equals: id } },
          });

          await payload.delete({
            collection: "toeic-attempts",
            overrideAccess: true,
            where: { user: { equals: id } },
          });

          await payload.delete({
            collection: "classes",
            overrideAccess: true,
            where: { user: { equals: id } },
          });

          payload.logger.info(`Pre-deletion cleanup completed for user ${id}`);
        } catch (error) {
          payload.logger.error(
            `Error in beforeDelete cleanup for user ${id}: ${error}`
          );
          throw error;
        }
      }) as CollectionBeforeDeleteHook,
    ],
    afterDelete: [cleanupRelatedUserData],
  },
  auth: true,
  fields: [
    {
      name: "fullname",
      required: true,
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "class",
      type: "relationship",
      relationTo: "classes",
      hasMany: true,
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "business", "user"],
    },
  ],
  timestamps: true,
};
