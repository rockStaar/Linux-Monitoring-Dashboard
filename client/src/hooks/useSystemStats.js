import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSystemStats() {
  const [cpu, setCpu] = useState(null);
  const [memory, setMemory] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => console.log("✅ Connected to backend"));
    socketRef.current.on("disconnect", () => console.log("❌ Disconnected from backend"));
    socketRef.current.on("stats", (data) => {
      console.log("📦 Stats received:", data);
      setCpu(data.cpu);
      setMemory(data.memory);
    });

    return () => {
      socketRef.current.disconnect();
      console.log("🔌 Socket cleanup");
    };
  }, []);

  return { cpu, memory };
}
