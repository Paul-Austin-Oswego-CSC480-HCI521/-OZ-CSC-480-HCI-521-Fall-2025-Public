import React, { useState } from 'react';

function SubmittedKudosProf({ submitted, onSelect}) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [readKudos, setReadKudos] = useState([]);

    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("newest");

    const sortedKudos = [...submitted].sort((a, b) => {
        if (selectedSort === "newest") {
            return new Date(b.date) - new Date(a.date);
        } else if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        } else if (selectedSort === "sender") {
            return a.sender.localeCompare(b.sender);
        } else if (selectedSort === "recipient") {
            return a.recipient.localeCompare(b.recipient);
        }
        return 0;
    });

    return (
        <section className="received-kudos">
            <div className="table-header">
            <h2>Submitted Kudos - {submitted.length}</h2>
            <div className="sort-dropdown-container">
              <button onClick={() => {
                setShowSort((prev) => !prev);
              }} className={`icon-btn sort-btn ${showSort ? "selected" : ""}`}>
                  <span className="sort-icon-label">Sort</span>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
                        <li onClick={() => {
                            setSelectedSort("recipient");
                            setShowSort(false);
                        }}
                        className={selectedSort === "recipient" ? "active" : ""}>
                            Recipient Last Name (A-Z)
                        </li>
                    </ul>
                </div>
                )}
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    {submitted.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="emptyTable">No Kudos to Review.</td>
                        </tr>
                    ) : (
                        sortedKudos.map((k, i) => (
                                <tr
                                    key={k.card_id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        setSelectedRows((prev) =>
                                        prev.includes(k.card_id) ? prev : [...prev, k.card_id]
                                    );
                                    onSelect(k);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setSelectedRows((prev) =>
                                                prev.includes(k.card_id) ? prev : [...prev, k.card_id]);
                                            onSelect(k);
                                        }
                                    }}
                                    className={`received-kudos-row ${
                                    selectedRows.includes(i) ? "selected-row" : ""}`}
                                >
                                    <td className="default-kudos-table-data">
                                        {k.status !== "RECEIVED" && (
                                            <span className="unread-indicator"></span>
                                        )}
                                        {k.sender}
                                    </td>
                                    <td className={`default-kudos-table-data`}>{k.recipient}</td>
                                    <td className={`default-kudos-table-data`}>{k.title}</td>
                                    <td className={`default-kudos-table-data`}>{k.message || k.content}</td>
                                    <td className={`default-kudos-table-data`}>{k.date}</td>
                                </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default SubmittedKudosProf;
