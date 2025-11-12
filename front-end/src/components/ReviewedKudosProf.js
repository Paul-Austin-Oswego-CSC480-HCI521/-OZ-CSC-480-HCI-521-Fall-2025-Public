import React, { useState, useEffect } from "react";
import { useUser, authFetch } from "./UserContext";

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
    const [availableRecipients, setAvailableRecipients] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);

    useEffect(() => {
      const fetchClasses = async () => {
        if (!user?.user_id) return;
        try {
          const BASE_URL = process.env.REACT_APP_API_BASE_URL;

          const [activeRes, archivedRes] = await Promise.all([
            authFetch(`${BASE_URL}/users/${user.user_id}/classes?is_archived=false`),
            authFetch(`${BASE_URL}/users/${user.user_id}/classes?is_archived=true`),
          ]);

          if (!activeRes.ok || !archivedRes.ok) throw new Error("Failed to fetch classes");

          const [activeData, archivedData] = await Promise.all([
            activeRes.json(),
            archivedRes.json(),
          ]);

          const allClassIds = [
            ...(activeData.class_id || []),
            ...(archivedData.class_id || []),
          ];

          if (allClassIds.length === 0) {
            setAvailableClasses([]);
            return;
          }

        const detailedClasses = await Promise.all(
          allClassIds.map(async (id) => {
            const classRes = await authFetch(`${BASE_URL}/class/${id}`);
            const classData = await classRes.json();
            const cls = classData.class[0];

            const usersRes = await authFetch(`${BASE_URL}/class/${id}/users`);
            const students = (await usersRes.json()) || [];
            return { ...cls, students };
          })
        );
        setAvailableClasses(detailedClasses);

        } catch (err) {
          console.error(err);
          setAvailableClasses([]);
        }
      };

      fetchClasses();
    }, [user]);

  useEffect(() => {
    if (!selectedClass) {
      setAvailableRecipients([]);
      return;
    }

    const cls = availableClasses.find(c => c.class_id === selectedClass);
    if (!cls || !cls.students) { // <-- added guard
      setAvailableRecipients([]);
      return;
    }

    const students = cls.students
      .filter(s => s.role?.toLowerCase() === "student")
      .map(s => s.name);

    setAvailableRecipients(students);
    setSelectedRecipient("");
  }, [selectedClass, availableClasses]);

    const filteredKudos = reviewedKudos.filter(k => {
      if (selectedClass && String(k.class_id) !== selectedClass) return false;
      if (selectedRecipient && k.recipient !== selectedRecipient) return false;
      if (selectedStatus && k.status !== selectedStatus) return false;

      if (selectedTimePeriod) {
        const now = new Date();
        const kDate = new Date(k.date);
        const diff = now - kDate;

        if (selectedTimePeriod === "24h" && diff > 24 * 60 * 60 * 1000) return false;
        if (selectedTimePeriod === "1w" && diff > 7 * 24 * 60 * 60 * 1000) return false;
        if (selectedTimePeriod === "1m" && diff > 30 * 24 * 60 * 60 * 1000) return false;
        if (selectedTimePeriod === "3m" && diff > 90 * 24 * 60 * 60 * 1000) return false;
        if (selectedTimePeriod === "6m" && diff > 180 * 24 * 60 * 60 * 1000) return false;
        if (selectedTimePeriod === "1y" && diff > 365 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });


    const sortedKudos = [...filteredKudos].sort((a, b) => {
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
            <h2>Reviewed Kudos - {filteredKudos.length}</h2>
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
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.class_name}
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
                      <th>Class</th> {/* New column */}
                      <th>Sender</th>
                      <th>Recipient</th>
                      <th>Title</th>
                      <th>Kudos Status (Approved, Rejected, Received, etc.)</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKudos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="emptyTable">
                          No Reviewed Kudos yet.
                        </td>
                      </tr>
                    ) : (
                      sortedKudos.map((k, i) => {
                        const cls = availableClasses.find(c => c.class_id === k.class_id);
                        console.log("k:", k);
                        const className = cls?.class_name;
                        console.log("className: ", className);

                        return (
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
                            <td className="reviewed-kudos-table-data">{className}</td> {/* New class cell */}
                            <td className="reviewed-kudos-table-data">{k.sender}</td>
                            <td className="reviewed-kudos-table-data">{k.recipient}</td>
                            <td className="reviewed-kudos-table-data">{k.title}</td>

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

                            <td className="reviewed-kudos-table-data">{k.date}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
            </div>
        </section>
    );
}

export default ReviewedKudosProf;
