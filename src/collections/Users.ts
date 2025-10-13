import type {
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
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

    // 4. Unlink this user from student list of class 'Class'
    const classesAsStudent = await payload.find({
      collection: "classes",
      overrideAccess: true,
      where: {
        student: {
          in: [id],
        },
      },
      limit: 1000,
    });

    if (classesAsStudent.docs.length > 0) {
      // Loop each class
      await Promise.all(
        classesAsStudent.docs.map(async (classDoc) => {
          const studentIds = (
            classDoc.student?.map((student) =>
              typeof student === "object" ? student.id : student
            ) ?? []
          ).filter((studentId) => studentId !== id);

          await payload.update({
            collection: "classes",
            overrideAccess: true,
            id: classDoc.id,
            data: {
              student: studentIds,
            },
          });
        })
      );
      payload.logger.info(`Unlinked student role for deleted user ${id}`);
    }
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

          const classesAsStudent = await payload.find({
            collection: "classes",
            overrideAccess: true,
            where: { student: { in: [id] } },
            limit: 1000,
          });

          if (classesAsStudent.docs.length > 0) {
            await Promise.all(
              classesAsStudent.docs.map(async (classDoc) => {
                const studentIds = (
                  classDoc.student?.map((student) =>
                    typeof student === "object" ? student.id : student
                  ) ?? []
                ).filter((studentId) => studentId !== id);

                await payload.update({
                  collection: "classes",
                  overrideAccess: true,
                  id: classDoc.id,
                  data: { student: studentIds },
                });
              })
            );
          }

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
