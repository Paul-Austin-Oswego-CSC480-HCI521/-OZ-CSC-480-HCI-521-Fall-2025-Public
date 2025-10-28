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
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
