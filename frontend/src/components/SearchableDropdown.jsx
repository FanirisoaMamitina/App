import React, { useState } from "react";

function SearchableDropdown({ options, placeholder = "Select an option", onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(term)
      )
    );
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setShowDropdown(false);
    setSearchTerm(""); // Reset search term after selection
  };

  return (
    <div style={{ position: "relative", width: "300px", margin: "10px auto" }}>
      {/* Select Box */}
      <div
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: "#fff",
        }}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {placeholder}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {/* Search Field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              border: "none",
              outline: "none",
              borderBottom: "1px solid #ccc",
            }}
          />

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div style={{ padding: "10px", color: "#aaa", textAlign: "center" }}>
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
