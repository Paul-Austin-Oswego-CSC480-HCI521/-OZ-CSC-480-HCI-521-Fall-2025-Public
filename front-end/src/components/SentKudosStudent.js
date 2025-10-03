import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";

function SentKudosStudent() {
    const { user } = useUser();
    const [sentKudos, setSentKudos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (!user) return;

        fetch("http://localhost:3001/cards")
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter(card =>
                    card.sender === user.name && card.senderId === user.id
                );
                setSentKudos(filtered);
            })
            .catch((err) => console.error("Error fetching sent kudos:", err));
        }, [user]);

    return (
        <section className="sent-kudos">
            <h2>Sent Kudos - ({sentKudos.length})</h2>

            {sentKudos.length === 0 ? (
                <p style={{ padding: "1rem", fontStyle: "italic" }}>No sent Kudos yet.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Title</th>
                        <th>Kudos Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sentKudos.map((k, i) => (
                        <tr
                            className={`received-kudos-row ${selectedRows.includes(i) ? "selected-row" : ""}`}
                            key={k.id || i}
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
                                    setSelectedRows(i);
                                    setSelectedImage(k.imageUrl);
                                }
                            }}
                        >
                            <td className={'default-kudos-table-data'}>{k.recipient}</td>
                            <td className={'default-kudos-table-data'}>{k.title || k.subject}</td>
                            <td className={'default-kudos-table-data'}>{k.status}</td>
                            <td className={'default-kudos-table-data'}>{k.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

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
