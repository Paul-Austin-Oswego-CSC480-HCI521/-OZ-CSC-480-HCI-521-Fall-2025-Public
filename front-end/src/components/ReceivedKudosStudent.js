import React, { useState } from "react";

function ReceivedKudosStudent( { received }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("newest");
    
    const sortedKudos = [...received].sort((a, b) => {
        if (selectedSort === "newest") {
            return new Date(b.date) - new Date(a.date);
        } else if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        } else if (selectedSort === "sender") {
            return a.sender.localeCompare(b.sender);
        }
        return 0;
    });

    return (
    <section className="received-kudos">
      <div className="section-header">
        <h2>Received Kudos - {received.length}</h2>

        <div className="sort-dropdown-container">
          <button onClick={() => {
            setShowSort((prev) => !prev);
          }} className={`icon-btn sort-btn ${showSort ? "selected" : ""}`}>
          <span className="sort-icon-label">Sort</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sort-desc"
            >
              <path d="M11 5h10" />
              <path d="M11 9h7" />
              <path d="M11 13h4" />
              <path d="M3 17l3 3 3-3" />
              <path d="M6 4v16" />
            </svg>
          </button>
          
          {showSort && (
            <div className="sort-dropdown">
                <ul>
                    <li onClick={() => {
                        setSelectedSort("newest");
                        setShowSort(false);
                    }}
                    className={selectedSort === "newest" ? "active" : ""}>
                        Date Submitted (Newest First)
                    </li>
                    <li onClick={() => {
                        setSelectedSort("oldest");
                        setShowSort(false);
                    }} className={selectedSort === "oldest" ? "active" : ""}>
                        Date Submitted (Oldest First)
                    </li>
                    <li onClick={() => {
                        setSelectedSort("sender");
                        setShowSort(false);
                    }}
                    className={selectedSort === "sender" ? "active" : ""}>
                        Sender Last Name (A-Z)
                    </li>
                </ul>
                </div>
            )}
            </div>
      </div>

        <div className = "table-container">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {received.length === 0 ? (
                <tr>
                  <td colSpan={4} className="emptyTable">
                    No Received Kudos yet.
                  </td>
                </tr>
              ) : (
                sortedKudos.map((k, i) => (
                  <tr
                    key={k.card_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedRows((prev) =>
                        prev.includes(i) ? prev : [...prev, i]
                      );
                      setSelectedImage(k.imageUrl);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedRows((prev) =>
                          prev.includes(i) ? prev : [...prev, i]
                        );
                        setSelectedImage(k.imageUrl);
                      }
                    }}
                    className={selectedRows.includes(i) ? "selected-row" : ""}
                  >
                    <td className="default-kudos-table-data">
                      {!selectedRows.includes(i) && (
                        <span className="unread-indicator" />
                      )}
                      {k.sender}
                    </td>
                    <td className="default-kudos-table-data">{k.title}</td>
                    <td className="default-kudos-table-data">{k.message}</td>
                    <td className="default-kudos-table-data">{k.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
            >
              ✖
            </button>
            <img src={selectedImage} alt="Kudos Card" />
          </div>
        </div>
      )}
    </section>
  );
}

export default ReceivedKudosStudent;