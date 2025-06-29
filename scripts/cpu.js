const fs = require("fs");

let prevIdle = 0;
let prevTotal = 0;

function getCPUUsage() {
  const stat = fs.readFileSync("/proc/stat", "utf8");
  const cpuLine = stat.split("\n")[0]; // 'cpu  ...'
  const values = cpuLine.trim().split(/\s+/).slice(1).map(Number);

  const [user, nice, system, idle, iowait, irq, softirq, steal] = values;
  const idleTime = idle + iowait;
  const totalTime = values.reduce((acc, val) => acc + val, 0);

  const diffIdle = idleTime - prevIdle;
  const diffTotal = totalTime - prevTotal;

  const cpuPercent = diffTotal ? ((1 - diffIdle / diffTotal) * 100).toFixed(2) : "0.00";

  prevIdle = idleTime;
  prevTotal = totalTime;

  return parseFloat(cpuPercent);
}

module.exports = { getCPUUsage };
