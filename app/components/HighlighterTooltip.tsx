export function HighlighterTooltip() {
    const styles = {
      container: { fontSize: "14px" },
      label: {
        padding: "2px 4px",
        borderRadius: "3px",
        margin: "4px 0",
      },
    };
    return (
      <div style={styles.container}>
        {[
          { label: "Fact", color: "yellow" },
          { label: "Value", color: "lightblue" },
          { label: "Policy", color: "lightgreen" },
        ].map((item) => (
          <p key={item.label}>
            <span style={{ ...styles.label, backgroundColor: item.color }}>
              {item.label}
            </span>
            <span style={{ marginLeft: "4px" }}>{item.color}</span>
          </p>
        ))}
      </div>
    );
  }
  