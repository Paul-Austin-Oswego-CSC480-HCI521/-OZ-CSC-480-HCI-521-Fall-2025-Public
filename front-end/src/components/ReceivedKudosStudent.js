import React, { useState, useEffect } from "react";
import AutoFitText from '../components/AutoFitText';
import { authFetch } from "./UserContext";

function ReceivedKudosStudent({ received }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSort, setShowSort] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [localReceived, setLocalReceived] = useState(received);

  useEffect(() => {
    console.log("Initial kudos statuses:");
    localReceived.forEach(k => {
      console.log(`Kudo ID ${k.id}: status = ${k.status}`);
    });
  }, [localReceived]);

  const imageMap = {
    'Well Done!': '/images/wellDoneNew.png',
    'Nice Job!': '/images/niceJobNew.png',
    'Great Work!': '/images/greatWorkNew.png',
  };

  const handleCardClick = async (kudo) => {
    setSelectedCard(kudo);

    if (kudo.status === 'APPROVED') {
      setLocalReceived(prev =>
        prev.map(k => k.id === kudo.id ? { ...k, status: "RECEIVED" } : k)
      );

      try {
        const BASE_URL = process.env.REACT_APP_API_BASE_URL;
        await authFetch(`${BASE_URL}/kudo-card/${kudo.id}/markAsRead`, {
          method: "PATCH",
        });
        console.log(`Kudo ${kudo.id} marked as RECEIVED`);
      } catch (err) {
        console.error(`Error updating kudo ${kudo.id} as RECEIVED:`, err);
      }
    }
  };

  const sortedKudos = [...localReceived].sort((a, b) => {
    if (selectedSort === "newest") return new Date(b.date) - new Date(a.date);
    if (selectedSort === "oldest") return new Date(a.date) - new Date(b.date);
    if (selectedSort === "sender") return a.sender.localeCompare(b.sender);
    return 0;
  });

  return (
    <section className="received-kudos">
      <div className="section-header">
        <h2>Received Kudos - {localReceived.length}</h2>

        <div className="sort-dropdown-container">
          <button
            onClick={() => setShowSort(prev => !prev)}
            className={`icon-btn sort-btn ${showSort ? "selected" : ""}`}
          >
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
                <li
                  onClick={() => { setSelectedSort("newest"); setShowSort(false); }}
                  className={selectedSort === "newest" ? "active" : ""}
                >
                  Date Submitted (Newest First)
                </li>
                <li
                  onClick={() => { setSelectedSort("oldest"); setShowSort(false); }}
                  className={selectedSort === "oldest" ? "active" : ""}
                >
                  Date Submitted (Oldest First)
                </li>
                <li
                  onClick={() => { setSelectedSort("sender"); setShowSort(false); }}
                  className={selectedSort === "sender" ? "active" : ""}
                >
                  Sender Last Name (A-Z)
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
              <th>Title</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {localReceived.length === 0 ? (
              <tr>
                <td colSpan={4} className="emptyTable">
                  No Received Kudos yet.
                </td>
              </tr>
            ) : (
              sortedKudos.map((k, i) => (
                <tr
                  key={k.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    console.log("card status:", k.status);
                    handleCardClick(k);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCardClick(k);
                  }}
                  className={`received-kudos-row ${
                  selectedRows.includes(i) ? "selected-row" : ""}`}
                >
                  <td className="default-kudos-table-data">
                    {k.status === "APPROVED" && <span className="unread-indicator" />}
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

      {selectedCard && (
        <div className="modal-overlay-rev" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-group">
              <button
                className="close-btn"
                onClick={() => setSelectedCard(null)}
                aria-label="Close image modal"
              >
                ✖
              </button>
            </div>

            <div className="image-preview-container-img">
              <img
                src={imageMap[selectedCard.title]}
                alt={selectedCard.title}
                style={{ width: '95%' }}
              />
              <div className="message-preview-container">
                <AutoFitText
                  text={selectedCard.message}
                  maxFontSize={32}
                  minFontSize={10}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReceivedKudosStudent;
