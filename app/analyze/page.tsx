"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ReplicatePage() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    // Fetch HTML content from the target URL
    async function fetchWebsiteHTML() {
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl as string)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch website content.");
        }
        const html = await response.text();
        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching website content:", error);
        setHtmlContent("<p>Error loading content. Please try again later.</p>");
      }
    }

    fetchWebsiteHTML();
  }, [targetUrl]);

  // Function to fetch claims using OpenAI's API
  const fetchClaimsFromOpenAI = async (text: string) => {
    const prompt = `
      Analyze the following text and identify all claims. For each claim, provide:
      - The exact text of the claim.
      - The claim type: "Fact", "Value", or "Policy".
      - A suggestion for a highlight color for each claim type.

      Respond strictly in JSON format as an array of objects:
      [
        { "substring": "Claim text here", "type": "Fact", "color": "yellow" },
        { "substring": "Claim text here", "type": "Value", "color": "lightblue" },
        { "substring": "Claim text here", "type": "Policy", "color": "lightgreen" },
        ...
      ]

      Text: "${text}"
    `;

    try {
      const response = await fetch(`${window.location.origin}/api/openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch claims from OpenAI.");
      }

      const data = await response.json();
      console.log("OpenAI Response:", data);

      // Parse and return the JSON response
      return data.claims.claims || [];
    } catch (error) {
      console.error("Error fetching claims from OpenAI:", error);
      return [];
    }
  };

  // Function to highlight text based on the claims
  const highlightText = async () => {
    const container = document.getElementById("replicated-content");

    if (container) {
      const claims = await fetchClaimsFromOpenAI(container.innerText);

      if (claims.length === 0) {
        console.log("No claims found.");
        return;
      }

      const regex = new RegExp(
        claims
          .map(({ substring }: { substring: string }) =>
            `(${substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`
          )
          .join("|"),
        "gi"
      );

      const highlightSubstrings = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent;

          if (!text?.trim()) return;

          const fragment = document.createDocumentFragment();
          let match;

          while ((match = regex.exec(text)) !== null) {
            const matchedSubstring = match[0];

            // Add text before the match
            if (match.index > 0) {
              fragment.appendChild(document.createTextNode(text.slice(0, match.index)));
            }

            // Highlight the matched substring
            const span = document.createElement("span");
            span.textContent = matchedSubstring;

            // Find the corresponding claim data
            const claimData = claims.find(
              (claim: { substring: string }) =>
                claim.substring.toLowerCase() === matchedSubstring.toLowerCase()
            );

            if (claimData) {
              span.style.backgroundColor = claimData.color;
              span.style.cursor = "pointer"; // Optional: Change cursor to pointer for better UX
              span.title = `Type: ${claimData.type}`; // Tooltip with claim type
            }

            fragment.appendChild(span);

            // Update remaining text
            text = text.slice(match.index + matchedSubstring.length);
            regex.lastIndex = 0; // Reset regex index
          }

          // Append remaining text
          if (text) {
            fragment.appendChild(document.createTextNode(text));
          }

          const parent = node.parentNode;
          if (parent) {
            parent.replaceChild(fragment, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.childNodes.forEach(highlightSubstrings);
        }
      };

      container.childNodes.forEach(highlightSubstrings);
    }
  };

  if (!targetUrl) {
    return <p className="text-red-500">Error: URL parameter is missing.</p>;
  }

  return (
    <div>
      {htmlContent ? (
        <div
          id="replicated-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>Loading...</p>
      )}

      {/* Overlay for triggering highlighting */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #ccc",
          borderRadius: "8px",
          zIndex: 9999,
          color: "black",
        }}
      >
        <h4>Claim Highlighter</h4>
        <button
          onClick={highlightText}
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Highlight Claims
        </button>
        <p>
          <span style={{ backgroundColor: "yellow", padding: "2px" }}>Fact</span>: Yellow
        </p>
        <p>
          <span style={{ backgroundColor: "lightblue", padding: "2px" }}>Value</span>: Light Blue
        </p>
        <p>
          <span style={{ backgroundColor: "lightgreen", padding: "2px" }}>Policy</span>: Light Green
        </p>
      </div>
    </div>
  );
}
