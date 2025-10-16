import type {
  CollectionAfterChangeHook,
  CollectionConfig,
  PayloadRequest,
} from "payload";
import { Readable } from "stream";
import csv from "csv-parser";
import { isSuperAdmin } from "@/lib/utils";
import { Class } from "@/payload-types";

// Helper function để validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const syncStudentsToClass = async (doc: Class, req: PayloadRequest) => {
  const { payload } = req;
  // Handle csv file
  if (doc.csvFile) {
    try {
      // Get file from media collection
      const mediaDoc = await payload.findByID({
        collection: "media",
        id: doc.csvFile as number,
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
          const filePath = path.join(process.cwd(), "media", mediaDoc.filename);
          csvText = await fs.readFile(filePath, "utf-8");
        } else {
          let fileUrl = mediaDoc.url;
          if (fileUrl.startsWith("/")) {
            const protocol = req.headers.get("x-forwarded-proto") || "http";
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
      console.log("Class data", doc);

      // Sử dụng Promise.all để xử lý song song, tăng tốc độ
      await Promise.all(
        emails.map(async (email) => {
          try {
            const { docs: existingUsers } = await payload.find({
              collection: "users",
              where: { email: { equals: email } },
              depth: 0,
              limit: 1,
            });

            if (existingUsers.length > 0) {
              const user = existingUsers[0];
              const userClasses = user.class || [];
              if (!userClasses.includes(doc.id)) {
                await payload.update({
                  collection: "users",
                  id: user.id,
                  data: {
                    class: [...userClasses, doc.id],
                  },
                  depth: 0, // Quan trọng: không populate sâu
                });
              }
            } else {
              // Tạo user mới
              await payload.create({
                collection: "users",
                data: {
                  email: email,
                  password: "student123",
                  fullname: email.split("@")[0],
                  roles: ["user"],
                  class: [doc.id],
                },
              });
            }
          } catch (e) {
            payload.logger.error(`Error processing email ${email}: ${e}`);
          }
        })
      );
    } catch (error) {
      console.error("Error handle CSV:", error);
    }
  }
};

const afterChangeHook: CollectionAfterChangeHook<Class> = ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create" && operation !== "update") return;
  // "Bắn và Quên": Thực thi hàm đồng bộ nhưng không `await`
  // Giao dịch chính sẽ kết thúc ngay lập tức và giải phóng lock
  syncStudentsToClass(doc, req).catch((err) => {
    req.payload.logger.error(`Failed to sync students in background: ${err}`);
  });
  return doc;
};

export const Classes: CollectionConfig = {
  slug: "classes",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: ({ req: { user } }) => {
      if (isSuperAdmin(user)) return true;
      if (user) {
        return { user: { equals: user.id } };
      }
      return false;
    },
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
      },
    ],
    afterChange: [afterChangeHook],
  },
};
