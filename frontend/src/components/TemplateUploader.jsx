import { useState } from "react";
import { uploadTemplate } from "../utils/api";

function TemplateUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PPTX file first!");
      return;
    }

    try {
      const result = await uploadTemplate(file);
      setMessage(result.message || "Template uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(result);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Failed to upload template.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Upload PPT Template</h2>

      <input
        type="file"
        accept=".pptx"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded-lg w-full mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Upload
      </button>

      {message && (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg text-sm text-gray-700 w-full text-center">
          {message}
        </div>
      )}
    </div>
  );
}

export default TemplateUploader;
