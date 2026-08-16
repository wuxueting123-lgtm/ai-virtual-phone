import path from "node:path"
import os from "node:os"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const isWindows = process.platform === "win32"
const isWslUncPath = projectRoot.startsWith("\\\\wsl$\\")

function resolveDistDir() {
  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }
  if (!isWindows || !isWslUncPath) {
    return ".next"
  }
  const safeProjectName = path.basename(projectRoot).replace(/[^a-zA-Z0-9_-]/g, "_")
  return path.join(os.tmpdir(), "next-dist-" + safeProjectName)
}

const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: projectRoot,
  distDir: "out",
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: "export",
  typescript: {
    ignoreBuildErrors: true
  },
  outputFileTracingIncludes: {
    "/api/**": ["./data/**"]
  },
  webpack: (config, { isServer, webpack }) => {
    // 关键修复：拦截所有 node: 协议
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "")
      })
    )
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        module: false
      }
    }
    return config
  }
}

export default nextConfig
