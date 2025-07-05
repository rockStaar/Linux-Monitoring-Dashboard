import useSystemStats from "./hooks/useSystemStats";

function Dashboard() {
  const { cpu, memory } = useSystemStats();

  return (
    <div style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>📊 HyprDash</h1>

      <p>🧠 CPU: {cpu ?? "Waiting..."}</p>

      <p>💾 RAM Used: {memory?.percentUsed ?? "Waiting..."}%</p>
      <p>🟩 Total: {memory?.total ?? "—"} kB</p>
      <p>🟦 Free: {memory?.free ?? "—"} kB</p>
      <p>🟨 Available: {memory?.available ?? "—"} kB</p>
      <p>🧊 Cached: {memory?.cached ?? "—"} kB</p>
    </div>
  );
}

export default Dashboard;
