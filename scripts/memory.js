const fs = require("fs");

function getMemoryStats() {
  const data = fs.readFileSync("/proc/meminfo", "utf8");
  const lines = data.split("\n");

  let memTotal = 0;
  let memAvailable = 0;

  for (let line of lines) {
    if (line.startsWith("MemTotal")) {
      memTotal = parseInt(line.match(/\d+/)[0]);
    } else if (line.startsWith("MemAvailable")) {
      memAvailable = parseInt(line.match(/\d+/)[0]);
    }
  }

  const used = memTotal - memAvailable;
  const percentUsed = ((used / memTotal) * 100).toFixed(2);

  return { memTotal, memAvailable, percentUsed };
}

module.exports = { getMemoryStats };
