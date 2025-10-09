// const API_BASE = "http://127.0.0.1:8000";

// // --- Generate PPT ---
// export async function generatePPT(topic, numSlides = 5, preview = true) {
//   const res = await fetch(
//     `${API_BASE}/generate/?topic=${encodeURIComponent(topic)}&slides=${numSlides}&preview=${preview}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     }
//   );
//   return res.json();
// }

// // --- Upload Template ---
// export async function uploadTemplate(file) {
//   const formData = new FormData();
//   formData.append("file", file);
//   const res = await fetch(`${API_BASE}/upload/`, {
//     method: "POST",
//     body: formData,
//   });
//   return res.json();
// }

// // --- Edit Slide API ---
// export const editSlide = {
//   preview: async (filename) => {
//     const res = await fetch(`${API_BASE}/edit/preview/?filename=${encodeURIComponent(filename)}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });
//     return res.json();
//   },

//   update: async (data) => {
//     const res = await fetch(`${API_BASE}/edit/update/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   },
// };
const API_BASE = "http://127.0.0.1:8000";

export async function generatePPT(topic, numSlides = 5, preview = true) {
  const res = await fetch(
    `${API_BASE}/generate?topic=${encodeURIComponent(topic)}&slides=${numSlides}&preview=${preview}`,
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );
  return res.json();
}

export async function uploadTemplate(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/generate/upload`, { method: "POST", body: formData });
  return res.json();
}

export async function updateSlide(data) {
  const query = new URLSearchParams(data).toString();
  const res = await fetch(`${API_BASE}/generate/update_slide?${query}`, { method: "POST" });
  return res.json();
}
