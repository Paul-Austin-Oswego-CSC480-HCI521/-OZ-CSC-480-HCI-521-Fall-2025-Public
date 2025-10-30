import React from "react";
// import "../styles/Wireframe.css";

/**
 * Props:
 * - tabs: Array of { label: string, value: string }
 * - activeTab: string
 * - onTabChange: function(value)
 */

function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="title-button-group">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`title-button ${activeTab === tab.value ? "selected" : ""}`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
