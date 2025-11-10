import React, { useState } from "react";
import ImageModal from "./ImageModal";
import { useUser } from "./UserContext";

function ReviewedKudosProf( {reviewedKudos = [], onSelect} ) {
    const [selectedRows, setSelectedRows] = useState([]);

    const [showFilter, setShowFilter] = useState(false);
    
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedRecipient, setSelectedRecipient] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("");

    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("newest");

    const { user } = useUser();

    const availableClasses = user?.classes || ["ABC101"];
    const availableRecipients = ["Santa", "Mrs. Clause", "Santa's 'Assistant'"];

    const sortedKudos = [...reviewedKudos].sort((a, b) => {
        if (selectedSort === "newest") {
            return new Date(b.date) - new Date(a.date);
        } else if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        } else if (selectedSort === "recipient") {
            return a.recipient.localeCompare(b.recipient);
        } else if (selectedSort === "sender") {
            return a.sender.localeCompare(b.sender);
        } else if (selectedSort === "status") {
            return a.status.localeCompare(b.status);
        }
        return 0;
    });

    return (
        <section className="sent-kudos">
            <div className="section-header">
            <h2>Reviewed Kudos - {reviewedKudos.length}</h2>
            <div className="filter-sort-controls">
            <div className = "filter-dropdown-container">
                <button onClick={() => setShowFilter((prev) => !prev)} 
                className={`icon-btn sort-btn ${showFilter ? "selected" : ""}`}>
                    <span className="sort-icon-label ">Filter</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-filter"
                    >
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                </button>

                {showFilter && (
              <div className="filter-dropdown">
                <div className="filter-group">
                  <label>Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedRecipient("");
                    }}
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClass && (
                  <div className="filter-group">
                    <label>Recipient</label>
                    <select
                      value={selectedRecipient}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                    >
                      <option value="">All Recipients</option>
                      {availableRecipients.map((rec) => (
                        <option key={rec} value={rec}>
                          {rec}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="DENIED">Denied</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Time Period</label>
                  <select
                    value={selectedTimePeriod}
                    onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  >
                    <option value="">All Time</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="1w">Last Week</option>
                    <option value="1m">Last Month</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>

                <div className="filter-actions">
                  <button
                    className="apply-btn"
                    onClick={() => {
                      console.log({
                        selectedClass,
                        selectedRecipient,
                        selectedStatus,
                        selectedTimePeriod,
                      });
                      setShowFilter(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="sort-dropdown-container">
              <button onClick={() => {
                setShowSort((prev) => !prev);
                setShowFilter(false);
              }} className={`icon-btn sort-btn ${showSort ? "selected" : ""}`}>
                  <span className="icon-label">| Sort</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
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
                        <li onClick={() => {
                            setSelectedSort("status");
                            setShowSort(false);
                        }}
                        className={selectedSort === "status" ? "active" : ""}
                        >Status
                        </li>
                    </ul>
                </div>
                )}
            </div>
            </div>
            </div>
            <div className = "table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Title</th>
                        <th>Kudos Status (Approved, Rejected, Received, etc.)</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviewedKudos.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="emptyTable">
                                No Reviewed Kudos yet.
                            </td>
                        </tr>
                    ) : (
                        sortedKudos.map((k, i) => (
                            <tr
                                className={`received-kudos-row ${selectedRows.includes(i) ? "selected-row" : ""}`}
                                key={k.card_id}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    setSelectedRows(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);
                                    if(onSelect) onSelect(k);
                                }}
                                onKeyDown={e => {
                                    if(e.key === "Enter" || e.key === " ") {
                                        setSelectedRows(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);
                                        if(onSelect) onSelect(k);
                                    }
                                }}
                            >
                                <td className={'reviewed-kudos-table-data'}>{k.sender}</td>
                                <td className={'reviewed-kudos-table-data'}>{k.recipient}</td>
                                <td className={'reviewed-kudos-table-data'}>{k.title}</td>

                                <td
                                    className={`reviewed-kudos-status ${
                                        k.status === "APPROVED" ? "approved" : "denied"
                                    } ${selectedRows.includes(i) ? "row-read" : ""}`}
                                >
                                    {k.status === "APPROVED" ? (
                                        <span>Approved</span>
                                    ) : (
                                        <>
                                            <span>Rejected:</span>{" "}
                                            {k.professor_note || "No reason provided"}
                                        </>
                                    )}
                                </td>

                                <td className={'reviewed-kudos-table-data'}>{k.date}</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ReviewedKudosProf;
