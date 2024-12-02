export function HighlightButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: "8px",
          backgroundColor: "#007BFF",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          marginBottom: "8px",
        }}
      >
        Highlight Claims
      </button>
    );
  }
  