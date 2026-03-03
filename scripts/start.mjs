/**
 * Custom start wrapper: replaces virtual adapter IPs (WSL, Hyper-V, etc.)
 * in Next.js startup output with the machine's real WiFi/Ethernet IP.
 */
import { spawn } from "child_process";
import { networkInterfaces } from "os";

const VIRTUAL_ADAPTERS = [
  "WSL",
  "vEthernet",
  "Loopback",
  "Hyper-V",
  "VirtualBox",
  "VMware",
  "Docker",
  "Bluetooth",
];

function getRealIP() {
  const ifaces = networkInterfaces();
  for (const [name, addrs] of Object.entries(ifaces)) {
    if (VIRTUAL_ADAPTERS.some((p) => name.includes(p))) continue;
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) return addr.address;
    }
  }
  return null;
}

const realIP = getRealIP();

const proc = spawn("next", ["start"], {
  stdio: ["inherit", "pipe", "inherit"],
  shell: true,
});

proc.stdout.on("data", (chunk) => {
  let text = chunk.toString();
  if (realIP) {
    // Replace any RFC-1918 / link-local IP in the "Network:" line with real IP
    text = text.replace(
      /Network:\s+http:\/\/[\d.]+:(\d+)/g,
      `Network: http://${realIP}:$1`
    );
  }
  process.stdout.write(text);
});

proc.on("exit", (code) => process.exit(code ?? 0));
