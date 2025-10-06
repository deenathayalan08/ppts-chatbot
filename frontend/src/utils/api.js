const API_BASE = "http://127.0.0.1:8000";

// --- Generate PPT ---
export async function generatePPT(topic, preview = false) {
  const url = `${API_BASE}/generate/?topic=${encodeURIComponent(topic)}&preview=${preview}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error("Failed to generate PPT");
  return preview ? res.json() : downloadBlob(await res.blob(), topic);
}

// --- Download helper ---
function downloadBlob(blob, topic) {
  const fileUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeTopic = topic.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.href = fileUrl;
  a.download = `${safeTopic || "generated_ppt"}.pptx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(fileUrl);
  return { message: `PPT downloaded as ${safeTopic}.pptx` };
}

// --- Upload Template ---
export async function uploadTemplate(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload/`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Template upload failed");
  return res.json();
}

// --- Edit slide ---
export async function editSlide(data) {
  const res = await fetch(`${API_BASE}/edit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Slide edit failed");
  return res.json();
}
