import React, { useState } from "react";

function SideBarFilterSearch({ setActiveTab, filters }) {
  const [activeTab, setLocalActiveTab] = useState("Products");

  const handleTabClick = (label) => {
    setActiveTab(label);
    setLocalActiveTab(label);
  };

  return (
    <aside className="shop-sidebar skeleton-body sidebar-fixed sticky-sidebar-wrapper sidebar-toggle-remain sidebar">
      <div className="sidebar-overlay"></div>
      <a className="sidebar-close" href="#">
        <i className="d-icon-times"></i>
      </a>
      <div className="sidebar-content">
        <div className="sticky-sidebar">
          <div className="widget widget-collapsible">
            <div className="">
              <h3 className="widget-title">All Filters</h3>
            </div>
            {/* List for desktop view */}
            <ul className="widget-body filter-items search-ul">
              {filters.map((filter) => (
                <li key={filter.label}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(filter.label);
                    }}
                    className={`${
                      activeTab === filter.label
                        ? "underline font-bold"
                        : "font-normal"
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Dropdown for mobile view */}
      <div className="mobile-menu-toggle d-show-mob">
        <div className="ml-3">
          <h3 className="widget-title">All Filters</h3>
        </div>
        <select
          onChange={(e) => handleTabClick(e.target.value)}
          value={activeTab}
          className="form-control"
        >
          {filters.map((filter) => (
            <option key={filter.label} value={filter.label}>
              {filter.label} ({filter.count})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default SideBarFilterSearch;
