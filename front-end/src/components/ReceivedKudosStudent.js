import React, { useState } from "react";

function ReceivedKudosStudent( { received }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <section className="received-kudos">
            <h2>Received Kudos - {received.length}</h2>
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
                received.map((k, i) => (
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
                                    prev.includes(i) ? prev : [...prev, i]);
                                setSelectedImage(k.imageUrl);
                            }
                        }}
                        className={selectedRows.includes(i) ? "selected-row" : ""}
                    >
                        <td className='default-kudos-table-data'>
                            {!selectedRows.includes(i) && <span className="unread-indicator" />}
                            {k.sender}
                        </td>
                        <td className={'default-kudos-table-data'}>{k.title}</td>
                        <td className={'default-kudos-table-data'}>{k.message}</td>
                        <td className={'default-kudos-table-data'}>{k.date}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>

            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}
                            aria-label="Close image modal">✖</button>
                        <img src={selectedImage} alt="Kudos Card" />
                    </div>
                </div>
            )}
        </section>
    );
}

export default ReceivedKudosStudent;
