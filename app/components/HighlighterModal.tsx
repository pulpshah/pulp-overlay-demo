import { HighlightButton } from "./HighlightButton";
import { HighlighterTooltip } from "./HighlighterTooltip";

export function HighlighterModal({
    isVisible,
    onClose,
    onHighlight,
  }: {
    isVisible: boolean;
    onClose: () => void;
    onHighlight: () => void;
  }) {
    if (!isVisible) return null;
  
    return (
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
          maxWidth: "200px",
        }}
      >
        <button
          onClick={onClose}
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
        <HighlightButton onClick={onHighlight} />
        <HighlighterTooltip />
      </div>
    );
  }
  