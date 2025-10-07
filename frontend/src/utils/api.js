const API_BASE = "http://127.0.0.1:8000";

export async function generatePPT(topic, preview = true) {
  const res = await fetch(`${API_BASE}/generate/generate/?topic=${encodeURIComponent(topic)}&preview=${preview}`, {
    method: "POST",
  });
  return res.json();
}
