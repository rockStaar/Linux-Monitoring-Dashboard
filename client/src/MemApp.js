import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

function MemApp() {
  const [memory, setMemory] = useState({});
  const [usedPercent, setUsedPercent] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => console.log("✅ Connected to backend"));

    socket.on("stats", (data) => {
      const mem = data?.memory;

      if (
        mem &&
        typeof mem.total === "number" &&
        typeof mem.available === "number" &&
        mem.total > 0
      ) {
        setMemory(mem);

        const percent = ((mem.total - mem.available) / mem.total) * 100;
        setUsedPercent(percent.toFixed(1));

        setHistory((prev) => [
          ...prev.slice(-59),
          {
            free: mem.free ?? 0,
            available: mem.available ?? 0,
            cached: mem.cached ?? 0,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          }
        ]);
      } else {
        console.warn("⚠️ Invalid memory data received:", mem);
      }
    });

    return () => socket.disconnect();
  }, []);

  const chartData = {
    labels: history.map((point) => point.time),
    datasets: [
      {
        label: "Free Memory",
        data: history.map((point) => point.free),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.2)",
        tension: 0.4,
        pointRadius: 1
      },
      {
        label: "Available Memory",
        data: history.map((point) => point.available),
        borderColor: "#2196f3",
        backgroundColor: "rgba(33,150,243,0.2)",
        tension: 0.4,
        pointRadius: 1
      },
      {
        label: "Cached Memory",
        data: history.map((point) => point.cached),
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,0.2)",
        tension: 0.4,
        pointRadius: 1
      }
    ]
  };

  const options = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `${(val / 1024).toFixed(0)} MB`
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  const usageColor =
    usedPercent > 80 ? "#f44336" : usedPercent > 50 ? "#ff9800" : "#00bcd4";

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "2rem",
        maxWidth: "700px",
        margin: "auto",
        position: "relative"
      }}
    >
      <h1>💾 HyprDash: Memory Monitor</h1>

      {usedPercent !== null && (
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: usageColor
          }}
        >
          🔥 Memory Used: {usedPercent}%
        </p>
      )}

      <p>🟩 Total: {memory.total ?? "—"} kB</p>
      <p>🟦 Free: {memory.free ?? "—"} kB</p>
      <p>🟨 Available: {memory.available ?? "—"} kB</p>
      <p>🧊 Cached: {memory.cached ?? "—"} kB</p>

      {history.length > 0 ? (
        <div style={{ width: "100%", height: "240px" }}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>📉 Waiting for memory data…</p>
      )}
    </div>
  );
}

export default MemApp;
