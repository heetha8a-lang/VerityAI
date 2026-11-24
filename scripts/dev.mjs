import { spawn } from "node:child_process";
import path from "node:path";

const nextBin = path.resolve(process.cwd(), "node_modules", ".bin", "next");

const child = spawn(nextBin, ["dev", "-p", "3000", "-H", "0.0.0.0"], {
  stdio: "inherit",
  env: process.env,
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
