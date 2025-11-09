import React from "react";

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
