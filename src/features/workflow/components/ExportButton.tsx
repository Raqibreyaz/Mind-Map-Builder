import React, { useState } from "react";
import { Download, Loader } from "lucide-react";

interface ExportButtonProps {
  onExportPNG: () => void;
  onExportGIF: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  isLoading?: boolean;
}

/**
 * Export Button Component
 * Shows dropdown menu with export options
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportPNG,
  onExportGIF,
  onExportSVG,
  onExportJSON,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          opacity: isLoading ? 0.6 : 1,
        }}
        onMouseOver={(e) => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#2563EB";
          }
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#3B82F6";
        }}
      >
        {isLoading ? (
          <>
            <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
            Exporting...
          </>
        ) : (
          <>
            <Download size={18} />
            Export
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            minWidth: "200px",
            overflow: "hidden",
          }}
        >
          {/* PNG Export */}
          <button
            onClick={() => handleExport(onExportPNG)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s ease",
              borderBottom: "1px solid #F3F4F6",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div style={{ fontWeight: "500", color: "#1F2937" }}>
              📸 Export as PNG
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
              Static high-quality image
            </div>
          </button>

          {/* GIF Export */}
          <button
            onClick={() => handleExport(onExportGIF)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s ease",
              borderBottom: "1px solid #F3F4F6",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div style={{ fontWeight: "500", color: "#1F2937" }}>
              🎬 Export as GIF
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
              Animated with moving edges
            </div>
          </button>

          {/* SVG Export */}
          <button
            onClick={() => handleExport(onExportSVG)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s ease",
              borderBottom: "1px solid #F3F4F6",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div style={{ fontWeight: "500", color: "#1F2937" }}>
              ✨ Export as SVG
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
              Vector format - infinite zoom
            </div>
          </button>

          {/* JSON Export */}
          <button
            onClick={() => handleExport(onExportJSON)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div style={{ fontWeight: "500", color: "#1F2937" }}>
              💾 Export as JSON
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
              Save workflow data
            </div>
          </button>
        </div>
      )}

      {/* Loading Animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
