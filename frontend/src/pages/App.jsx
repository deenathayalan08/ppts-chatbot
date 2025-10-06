import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";

function App() {
  const [activeOption, setActiveOption] = useState(null); // 'generate' or 'edit'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-10">PPT Chatbot</h1>

      {!activeOption && (
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <button
            onClick={() => setActiveOption("generate")}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-48 text-center"
          >
            Generate PPT
          </button>
          <button
            onClick={() => setActiveOption("edit")}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition w-48 text-center"
          >
            Edit PPT
          </button>
        </div>
      )}

      {activeOption && (
        <div className="w-full max-w-2xl">
          <ChatInterface />
          <div className="mt-6 text-center">
            <button
              onClick={() => setActiveOption(null)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
