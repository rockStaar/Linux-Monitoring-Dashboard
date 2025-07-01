import CpuApp from "./CpuApp";
import MemApp from "./App";

function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        fontFamily: "monospace"
      }}
    >
      <div style={{ flex: "1 1 45%", minWidth: "320px" }}>
        <CpuApp />
      </div>
      <div style={{ flex: "1 1 45%", minWidth: "320px" }}>
        <MemApp />
      </div>
    </div>
  );
}

export default Dashboard;
