import type { CollectionConfig } from "payload";
import { Readable } from "stream";
import csv from "csv-parser";

// Helper function để validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const Classes: CollectionConfig = {
  slug: "classes",
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        };
      }
      return false;
    },
    delete: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        };
      }
      return false;
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "exams",
      type: "relationship",
      relationTo: "exams",
      hasMany: true,
    },
    {
      name: "csvFile",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Upload student file (csv)",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create" && req.user) {
          data.user = req.user.id;
        }

        if (operation !== "create" && operation !== "update") return;

        // Handle csv file
        if (data.csvFile) {
          try {
            // Get file from media collection
            const mediaDoc = await req.payload.findByID({
              collection: "media",
              id: data.csvFile,
            });

            if (!mediaDoc || !mediaDoc.url) {
              console.error("File not found");
              return;
            }

            console.log("csv url", mediaDoc.url);

            const emails: string[] = [];

            let csvText: string;
            try {
              if (mediaDoc.filename) {
                const fs = await import("fs/promises");
                const path = await import("path");
                const filePath = path.join(
                  process.cwd(),
                  "media",
                  mediaDoc.filename
                );
                csvText = await fs.readFile(filePath, "utf-8");
              } else {
                let fileUrl = mediaDoc.url;
                if (fileUrl.startsWith("/")) {
                  const protocol =
                    req.headers.get("x-forwarded-proto") || "http";
                  const host =
                    req.headers.get("host") || process.env.NEXT_PUBLIC_APP_URL;
                  fileUrl = `${protocol}://${host}${mediaDoc.url}`;
                }
                const response = await fetch(fileUrl);

                if (!response.ok) {
                  console.error("Failed to upload CSV");
                  return;
                }

                csvText = await response.text();
              }
            } catch (error) {
              console.error("Failed to read CSV:", error);
              return;
            }

            // Tạo stream từ text
            const stream = Readable.from([csvText]);

            // Parse CSV với csv-parser
            await new Promise<void>((resolve, reject) => {
              stream
                .pipe(csv())
                .on("data", (row) => {
                  for (const [, value] of Object.entries(row)) {
                    const emailValue = String(value).trim();
                    if (emailValue && isValidEmail(emailValue)) {
                      emails.push(emailValue);
                      break;
                    }
                  }
                })
                .on("end", () => {
                  resolve();
                })
                .on("error", (error) => {
                  console.error("Error parse CSV:", error);
                  reject(error);
                });
            });

            console.log(`Found ${emails.length} email included in CSV`);

            // Handle each email
            const existingStudentIds = data.student || [];
            const newStudentIds: number[] = [];

            for (const email of emails) {
              try {
                const existingUsers = await req.payload.find({
                  collection: "users",
                  where: {
                    email: {
                      equals: email,
                    },
                  },
                  limit: 1,
                });

                if (existingUsers.docs.length > 0) {
                  // Existed email, add to new student list
                  const existingUser = existingUsers.docs[0];
                  const existingId = Number(existingUser.id);
                  if (!existingStudentIds.includes(existingId)) {
                    newStudentIds.push(existingId);
                  }
                  console.log(`Email ${email} was existed, add to class`);
                } else {
                  // Create new user
                  const tempPassword = "student123";
                  const newUser = await req.payload.create({
                    collection: "users",
                    data: {
                      email: email,
                      password: tempPassword,
                      fullname: email.split("@")[0],
                      roles: ["user"],
                    },
                  });

                  newStudentIds.push(Number(newUser.id));
                  console.log(
                    `Create new user with email: ${email}, password: ${tempPassword}`
                  );
                }
              } catch (error) {
                console.error(`Error ${email} handler:`, error);
              }
            }

            // Update student list
            if (newStudentIds.length > 0) {
              const updatedStudentIds = [
                ...existingStudentIds,
                ...newStudentIds,
              ];

              data.student = updatedStudentIds;
              console.log(`Add ${newStudentIds.length} new student into class`);
            }
          } catch (error) {
            console.error("Error handle CSV:", error);
          }
        }
      },
    ],
  },
};
