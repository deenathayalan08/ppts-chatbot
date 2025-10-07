import { useState } from "react";
import { uploadTemplate } from "../utils/api";

function TemplateUploader({ file, setFile }) {
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PPTX file first!");
      return;
    }

    const result = await uploadTemplate(file);
    setMessage(result.message || "Template uploaded successfully!");
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      <input
        type="file"
        accept=".pptx"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded-lg w-full"
      />

      <button
        onClick={handleUpload}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
      >
        Upload Template
      </button>

      {message && (
        <div className="mt-2 bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
}

export default TemplateUploader;
