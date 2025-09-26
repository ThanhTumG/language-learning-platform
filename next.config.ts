import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname, // Explicitly set the root directory
};

export default withPayload(nextConfig);
