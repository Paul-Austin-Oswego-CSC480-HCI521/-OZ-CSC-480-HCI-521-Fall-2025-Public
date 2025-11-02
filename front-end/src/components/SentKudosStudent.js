import React, { useState } from "react";

function SentKudosStudent( {messages = []} ) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const sentKudos = messages;

    return (
        <section className="sent-kudos">
            <h2>Sent Kudos - {sentKudos.length}</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Title</th>
                        <th>Kudos Status (Approved, Rejected, Pending)</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                        {sentKudos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="emptyTable">
                                    No sent Kudos yet.
                                </td>
                            </tr>
                        ) : (
                            sentKudos.map((k, i) => (
                            <tr
                                className={`received-kudos-row ${selectedRows.includes(i) ? "selected-row" : ""}`}
                                key={k.card_id}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    setSelectedRows((prev) =>
                                        prev.includes(i) ? prev.filter((idx) => idx !== i): [...prev, i]
                                    );
                                    setSelectedImage(k.imageUrl);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setSelectedRows((prev) =>
                                            prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]);
                                        setSelectedImage(k.imageUrl);
                                    }
                                }}
                            >
                                <td className={'reviewed-kudos-table-data'}>{k.recipient}</td>
                                <td className={'reviewed-kudos-table-data'}>{k.title}</td>
                                <td
                                    className={`reviewed-kudos-status ${
                                        k.status === "APPROVED" ? "approved" :
                                        k.status === "DENIED" ? "denied" :
                                        "pending"
                                    } ${selectedRows.includes(i) ? "row-read" : ""}`}
                                >
                                    {k.status === "APPROVED" ? (
                                        <span>Approved</span>
                                    ) : k.status === "DENIED" ? (
                                        <>
                                            <span>Rejected:</span>{" "}
                                            {k.professor_note || "No reason provided"}
                                        </>
                                        ) : (
                                            <span>Pending</span>
                                    )}
                                </td>
                                <td className={'reviewed-kudos-table-data'}>{k.date}</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>

            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>✖</button>
                        <img src={selectedImage} alt="Kudos" />
                    </div>
                </div>
            )}
        </section>
    );
}

export default SentKudosStudent;
