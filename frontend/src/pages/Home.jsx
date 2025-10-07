import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center">
      <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">PPT Chatbot</h1>
      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/generate")}
          className="px-8 py-4 bg-white text-purple-700 font-semibold text-lg rounded-2xl shadow-md hover:scale-105 transition-transform"
        >
          Generate PPT
        </button>
        <button
          onClick={() => navigate("/edit")}
          className="px-8 py-4 bg-white text-purple-700 font-semibold text-lg rounded-2xl shadow-md hover:scale-105 transition-transform"
        >
          Edit PPT
        </button>
      </div>
    </div>
  );
}
