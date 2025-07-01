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

// Register Chart.js components once
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

function App() {
  const [cpu, setCpu] = useState(null);
  const [ram, setRam] = useState(null);
  const [memory, setMemory] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const socket = io("http://192.168.0.236:4000");

    socket.on("connect", () => console.log("✅ Connected to backend"));

    socket.on("stats", (data) => {
      setCpu(data.cpu);
      setRam(data.memory.percentUsed);
      setMemory(data.memory);

      setHistory((prev) => [
        ...prev.slice(-59),
        {
          cpu: parseFloat(data.cpu),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })
        }
      ]);
    });

    return () => socket.disconnect();
  }, []);

  const chartData = {
    labels: history.map((point) => point.time),
    datasets: [
      {
        label: "CPU Usage",
        data: history.map((point) => point.cpu),
        borderColor: "#00bcd4",
        backgroundColor: "rgba(0,188,212,0.2)",
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
        max: 100,
        ticks: {
          callback: (val) => `${val}%`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Determine CPU label color
  const cpuColor =
    cpu > 80 ? "#f44336" : cpu > 50 ? "#ffc107" : "#00bcd4";

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
      <h1>🖥️ HyprDash</h1>

      {/* Floating CPU label in top-right corner */}
      {cpu !== null && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "2rem",
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: cpuColor
          }}
        >
          CPU: {parseFloat(cpu).toFixed(1)}%
        </div>
      )}

      <p>🧠 CPU: {cpu !== null ? `${cpu}%` : "Loading..."}</p>
      <p>💾 RAM Used: {ram !== null ? `${ram}%` : "Loading..."}</p>

      <p>🟩 Total: {memory?.total ?? "—"} kB</p>
      <p>🟦 Free: {memory?.free ?? "—"} kB</p>
      <p>🟨 Available: {memory?.available ?? "—"} kB</p>
      <p>🧊 Cached: {memory?.cached ?? "—"} kB</p>

      {history.length > 0 ? (
        <div style={{ width: "100%", height: "220px" }}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>📉 Waiting for CPU data…</p>
      )}
    </div>
  );
}

export default App;
