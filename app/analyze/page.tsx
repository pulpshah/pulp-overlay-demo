"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import ChatPill from "../CommentBox/ChatPill";


function ReplicatePage() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [showChat] = useState(true);
  const [showHighlighter, setShowHighlighter] = useState(true);

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
              span.style.cursor = "pointer";
              span.title = `Type: ${claimData.type}`;
            }

            fragment.appendChild(span);

            // Update remaining text
            text = text.slice(match.index + matchedSubstring.length);
            regex.lastIndex = 0;
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
    <div className="relative">
      {htmlContent ? (
        <div
          id="replicated-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>Loading...</p>
      )}

      {/* Single Claim Highlighter UI */}
      {showHighlighter && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 9999,
            color: "black",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "200px"
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowHighlighter(false)}
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#718096",
            }}
          >
            ×
          </button>

          <h4 style={{ marginTop: 0, marginBottom: "8px" }}>Claim Highlighter</h4>
          <button
            onClick={highlightText}
            style={{
              padding: "8px",
              backgroundColor: "#007BFF",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              marginBottom: "8px"
            }}
          >
            Highlight Claims
          </button>
          
          <div style={{ fontSize: "14px" }}>
            <p style={{ margin: "4px 0" }}>
              <span style={{ backgroundColor: "yellow", padding: "2px 4px", borderRadius: "3px" }}>Fact</span>
              <span style={{ marginLeft: "4px" }}>Yellow</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ backgroundColor: "lightblue", padding: "2px 4px", borderRadius: "3px" }}>Value</span>
              <span style={{ marginLeft: "4px" }}>Light Blue</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ backgroundColor: "lightgreen", padding: "2px 4px", borderRadius: "3px" }}>Policy</span>
              <span style={{ marginLeft: "4px" }}>Light Green</span>
            </p>
          </div>
        </div>
      )}

      {/* Chat Pill */}
      {showChat && (
        <ChatPill 
          slug={targetUrl} 
          email={null} 
        />
      )}

      {/* Restore button if highlighter is closed */}
      {!showHighlighter && (
        <button
          onClick={() => setShowHighlighter(true)}
          style={{
            position: "fixed",
            left: "10px",
            bottom: "10px",
            padding: "8px 12px",
            backgroundColor: "#4299e1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            zIndex: 9998,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Show Highlighter
        </button>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <ReplicatePage />
    </Suspense>
  );
}

// "use client";

// import { useSearchParams } from "next/navigation";
// import React, { Suspense, useEffect, useState, useCallback } from "react";
// import ChatPill from "../CommentBox/ChatPill";

// type ContextMenuPosition = {
//   x: number;
//   y: number;
// } | null;

// function ReplicatePage() {
//   const searchParams = useSearchParams();
//   const targetUrl = searchParams.get("url");
//   const [htmlContent, setHtmlContent] = useState<string | null>(null);
//   const [showChat] = useState(true);
//   const [showHighlighter, setShowHighlighter] = useState(true);
//   const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition>(null);
//   const [selectedText, setSelectedText] = useState("");
//   const [selectedClaimType, setSelectedClaimType] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchWebsiteHTML() {
//       try {
//         const response = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl as string)}`);
//         if (!response.ok) throw new Error("Failed to fetch website content.");
//         const html = await response.text();
//         setHtmlContent(html);
//       } catch (error) {
//         console.error("Error fetching website content:", error);
//         setHtmlContent("<p>Error loading content. Please try again later.</p>");
//       }
//     }
//     fetchWebsiteHTML();
//   }, [targetUrl]);

//   const fetchClaimsFromOpenAI = async (text: string) => {
//     const prompt = `
//       Analyze the following text and identify all claims. For each claim, provide:
//       - The exact text of the claim
//       - The claim type: "Fact", "Value", or "Policy"
//       - A suggestion for a highlight color for each claim type

//       Respond strictly in JSON format as an array of objects:
//       [
//         { "substring": "Claim text here", "type": "Fact", "color": "yellow" },
//         { "substring": "Claim text here", "type": "Value", "color": "lightblue" },
//         { "substring": "Claim text here", "type": "Policy", "color": "lightgreen" }
//       ]

//       Text: "${text}"
//     `;

//     try {
//       const response = await fetch(`${window.location.origin}/api/openai`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to fetch claims from OpenAI.");
//       }

//       const data = await response.json();
//       return data.claims.claims || [];
//     } catch (error) {
//       console.error("Error fetching claims from OpenAI:", error);
//       return [];
//     }
//   };

//   const highlightText = async () => {
//     const container = document.getElementById("replicated-content");
//     if (!container) return;

//     const claims = await fetchClaimsFromOpenAI(container.innerText);
//     if (claims.length === 0) {
//       console.log("No claims found.");
//       return;
//     }

//     const regex = new RegExp(
//       claims
//         .map(({ substring }: { substring: string }) =>
//           `(${substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`
//         )
//         .join("|"),
//       "gi"
//     );

//     const highlightSubstrings = (node: Node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         let text = node.textContent;
//         if (!text?.trim()) return;

//         const fragment = document.createDocumentFragment();
//         let match;

//         while ((match = regex.exec(text)) !== null) {
//           const matchedSubstring = match[0];

//           if (match.index > 0) {
//             fragment.appendChild(document.createTextNode(text.slice(0, match.index)));
//           }

//           const span = document.createElement("span");
//           span.textContent = matchedSubstring;

//           const claimData = claims.find(
//             (claim: { substring: string }) =>
//               claim.substring.toLowerCase() === matchedSubstring.toLowerCase()
//           );

//           if (claimData) {
//             span.style.backgroundColor = claimData.color;
//             span.style.cursor = "pointer";
//             span.title = `Type: ${claimData.type}`;
//           }

//           fragment.appendChild(span);
//           text = text.slice(match.index + matchedSubstring.length);
//           regex.lastIndex = 0;
//         }

//         if (text) {
//           fragment.appendChild(document.createTextNode(text));
//         }

//         const parent = node.parentNode;
//         if (parent) {
//           parent.replaceChild(fragment, node);
//         }
//       } else if (node.nodeType === Node.ELEMENT_NODE) {
//         node.childNodes.forEach(highlightSubstrings);
//       }
//     };

//     container.childNodes.forEach(highlightSubstrings);
//   };

//   const handleSelection = useCallback((event: MouseEvent) => {
//     const selection = window.getSelection();
//     if (!selection || selection.toString().trim() === "") {
//       setContextMenuPosition(null);
//       setSelectedText("");
//       return;
//     }

//     const selectedElement = selection.anchorNode?.parentElement;
//     const claimType = selectedElement?.title?.replace("Type: ", "") || null;
//     setSelectedClaimType(claimType);
//     setSelectedText(selection.toString());

//     setContextMenuPosition({
//       x: event.pageX,
//       y: event.pageY
//     });
//   }, []);

//   useEffect(() => {
//     document.addEventListener("mouseup", handleSelection);
    
//     const handleClickOutside = (event: MouseEvent) => {
//       const menu = document.getElementById("context-menu");
//       if (menu && !menu.contains(event.target as Node)) {
//         setContextMenuPosition(null);
//       }
//     };
    
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mouseup", handleSelection);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [handleSelection]);

//   const handleAskAI = () => {
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHHH");
//     if (selectedText && showChat) {
//       window.dispatchEvent(new CustomEvent('triggerAIAssistant', {
//         detail: {
//           text: selectedText,
//           type: selectedClaimType
//         }
//       }));
//     }
//     setContextMenuPosition(null);
//   };

//   const ContextMenu = () => {
//     if (!contextMenuPosition) return null;

//     return (
//       <div
//         id="context-menu"
//         className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50"
//         style={{
//           left: `${contextMenuPosition.x}px`,
//           top: `${contextMenuPosition.y}px`,
//           minWidth: "200px"
//         }}
//       >
//         <button
//           onClick={() => {
//             console.log("See related for:", selectedText);
//             setContextMenuPosition(null);
//           }}
//           className="w-full text-left px-4 py-2 hover:bg-gray-100"
//         >
//           See Related
//         </button>
//         <button
//           onClick={() => {
//             console.log("Flagged:", selectedText);
//             setContextMenuPosition(null);
//           }}
//           className="w-full text-left px-4 py-2 hover:bg-gray-100"
//         >
//           Flag
//         </button>
//         {selectedClaimType && (
//           <button
//             onClick={() => {
//               console.log(`${selectedClaimType} action for:`, selectedText);
//               setContextMenuPosition(null);
//             }}
//             className="w-full text-left px-4 py-2 hover:bg-gray-100"
//           >
//             {selectedClaimType === "Fact" && "Verify Fact"}
//             {selectedClaimType === "Value" && "Discuss Value"}
//             {selectedClaimType === "Policy" && "Analyze Policy"}
//           </button>
//         )}
//         <button
//   onClick={(e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("Button clicked");
//     handleAskAI();
//   }}
//   className="w-full text-left px-4 py-2 hover:bg-gray-100"
// >
//   Ask AI
// </button>
//         <button
//           onClick={() => {
//             console.log("Add comment for:", selectedText);
//             setContextMenuPosition(null);
//           }}
//           className="w-full text-left px-4 py-2 hover:bg-gray-100"
//         >
//           Add Comment
//         </button>
//       </div>
//     );
//   };

//   if (!targetUrl) {
//     return <p className="text-red-500">Error: URL parameter is missing.</p>;
//   }

//   return (
//     <div className="relative">
//       {htmlContent ? (
//         <div
//           id="replicated-content"
//           dangerouslySetInnerHTML={{ __html: htmlContent }}
//         />
//       ) : (
//         <p>Loading...</p>
//       )}

//       {showHighlighter && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "10px",
//             left: "10px",
//             padding: "10px",
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             zIndex: 9999,
//             color: "black",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             maxWidth: "200px"
//           }}
//         >
//           <button
//             onClick={() => setShowHighlighter(false)}
//             style={{
//               position: "absolute",
//               right: "8px",
//               top: "8px",
//               background: "none",
//               border: "none",
//               fontSize: "16px",
//               cursor: "pointer",
//               color: "#718096",
//             }}
//           >
//             ×
//           </button>

//           <h4 style={{ marginTop: 0, marginBottom: "8px" }}>Claim Highlighter</h4>
//           <button
//             onClick={highlightText}
//             style={{
//               padding: "8px",
//               backgroundColor: "#007BFF",
//               color: "#FFF",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               width: "100%",
//               marginBottom: "8px"
//             }}
//           >
//             Highlight Claims
//           </button>
          
//           <div style={{ fontSize: "14px" }}>
//             <p style={{ margin: "4px 0" }}>
//               <span style={{ backgroundColor: "yellow", padding: "2px 4px", borderRadius: "3px" }}>Fact</span>
//               <span style={{ marginLeft: "4px" }}>Yellow</span>
//             </p>
//             <p style={{ margin: "4px 0" }}>
//               <span style={{ backgroundColor: "lightblue", padding: "2px 4px", borderRadius: "3px" }}>Value</span>
//               <span style={{ marginLeft: "4px" }}>Light Blue</span>
//             </p>
//             <p style={{ margin: "4px 0" }}>
//               <span style={{ backgroundColor: "lightgreen", padding: "2px 4px", borderRadius: "3px" }}>Policy</span>
//               <span style={{ marginLeft: "4px" }}>Light Green</span>
//             </p>
//           </div>
//         </div>
//       )}

//       <ContextMenu />

//       {showChat && (
//         <ChatPill 
//           slug={targetUrl} 
//           email={null} 
//         />
//       )}

//       {!showHighlighter && (
//         <button
//           onClick={() => setShowHighlighter(true)}
//           style={{
//             position: "fixed",
//             left: "10px",
//             bottom: "10px",
//             padding: "8px 12px",
//             backgroundColor: "#4299e1",
//             color: "white",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//             zIndex: 9998,
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           Show Highlighter
//         </button>
//       )}
//     </div>
//   );
// }

// export default function AnalyzePage() {
//   return (
//     <Suspense fallback={<p>Loading page...</p>}>
//       <ReplicatePage />
//     </Suspense>
//   );
// }
