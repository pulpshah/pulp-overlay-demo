"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const queryParams = new URLSearchParams({
      url
    });

    // Navigate to the analysis page with query params
    router.push(`/analyze?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Analyze Webpage Content
        </h1>
        <form onSubmit={handleSubmit}>
          {/* URL Input */}
          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
              Enter the URL:
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              required
            />
          </div>

          {/* Claim Types */}
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Claim Types:
            </label>
            <div className="flex flex-col space-y-2">
              {claimOptions.map((claim) => (
                <label key={claim} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={claim}
                    checked={selectedClaimTypes.includes(claim)}
                    onChange={() => handleCheckboxChange(claim)}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="text-gray-700">{claim}</span>
                </label>
              ))}
            </div>
          </div> */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
