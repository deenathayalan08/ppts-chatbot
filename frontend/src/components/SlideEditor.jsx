import React, { useState } from "react";
import { editSlide, uploadTemplate, previewPPT } from "../utils/api";

const SlideEditor = () => {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");

  const handleFileUpload = async (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setStatus("Uploading PPT...");
    try {
      const data = await uploadTemplate(uploaded);
      const previewData = await previewPPT(data.filename);
      setSlides(previewData.slides || []);
      setStatus("File uploaded successfully! You can now edit slides.");
    } catch (err) {
      console.error(err);
      setStatus("Error uploading file.");
    }
  };

  const handleEdit = async (index) => {
    if (!file) return;
    setEditingIndex(index);
    setTitle(slides[index].title || "");
    setBody(slides[index].body || "");
  };

  const handleSave = async () => {
    if (editingIndex === null) return;
    setStatus("Saving changes...");
    try {
      await editSlide(file.name, editingIndex + 1, title, body);
      setSlides((prev) =>
        prev.map((slide, idx) =>
          idx === editingIndex ? { ...slide, title, body } : slide
        )
      );
      setStatus("Slide updated successfully!");
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      setStatus("Error updating slide.");
    }
  };

  const handleMediaUpload = async (index) => {
    if (!file || !mediaFile) return;
    setStatus("Adding media...");
    try {
      const formData = new FormData();
      formData.append("filename", file.name);
      formData.append("slide_number", index + 1);
      formData.append("file", mediaFile);
      formData.append("media_type", mediaType);

      const res = await fetch("http://127.0.0.1:8000/add-media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.message) setStatus(data.message);
      else setStatus("Failed to add media.");
    } catch (err) {
      console.error(err);
      setStatus("Error uploading media.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-center mb-4">Edit Existing PPT</h2>

      {/* Upload PPT */}
      <input type="file" accept=".pptx" onChange={handleFileUpload} className="border p-2 rounded w-full mb-2" />

      {slides.length > 0 && (
        <div className="w-full mt-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-4 bg-white shadow">
              <h3 className="font-semibold mb-2">Slide {idx + 1}</h3>

              {editingIndex === idx ? (
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Slide Title"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Slide Content"
                    rows="4"
                    className="border p-2 rounded w-full mb-2"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <strong>{slide.title}</strong>
                  <p>{slide.body}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}

              {/* Media Upload Section */}
              <div className="mt-4 border-t pt-2">
                <label className="block text-sm font-medium mb-1">
                  Add Image/Video to this Slide:
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="border p-1 rounded mb-2"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="file"
                  accept={mediaType === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  className="border p-1 rounded mb-2"
                />
                <button
                  onClick={() => handleMediaUpload(idx)}
                  className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Upload {mediaType}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-700">{status}</p>
    </div>
  );
};

export default SlideEditor;
