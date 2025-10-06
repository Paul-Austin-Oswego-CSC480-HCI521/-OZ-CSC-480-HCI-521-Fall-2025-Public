import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";

function ReceivedKudosStudent() {
       const [received, setReceived] = useState([]);
       const [selectedImage, setSelectedImage] = useState(null);
       const [selectedRows, setSelectedRows] = useState([]);
       const { user } = useUser();

       const BASE_URL = "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api";

       useEffect(() => {
           if (!user) return;
           const fetchReceivedKudos = async () => {
               try {
                   const listRes = await fetch(
                       `${BASE_URL}/kudo-card/list/received?user_id=${user.id}'`
                   );
                   if (!listRes.ok)
                       throw new Error("Failed to fetch card list");

                   const listData = await listRes.json();
                   const cardIds = listData.card_id || [];

                   const cardPromises = cardIds.map((id) =>
                       fetch(`${BASE_URL}/kudo-card/${id}?user_id=${user.id}`).then((res) =>
                           res.json()
                       )
                   );

                   const cards = await Promise.all(cardPromises);

                   const approvedCards = cards.filter(
                       (card) => card.status === "APPROVED"
                   );

                   const formatted = approvedCards.map((card) => ({
                       sender: card.sender_id || "Anonymous",
                       title: card.title,
                       message: card.content,
                       date: card.dateSent || "-",
                       imageUrl: card.imageUrl || null,
                   }));

                   setReceived(formatted);
               } catch (error) {
                   console.error("Error fetching received kudos:", error);
               }
           };

           fetchReceivedKudos();
       }, [user]);

    return (
        <section className="received-kudos">
            <h2>Received Kudos - ({received.length})</h2>
            {received.length === 0 ? (
                <p style={{padding: "1rem", fontStyle: "italic" }}>No received Kudos yet.</p>
            ) : (
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
                {received.map((k, i) => (
                    <tr
                        key={i}
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
                        className={selectedRows.includes(i) ? "selected-row" : ""}
                    >
                        <td className={'default-kudos-table-data'}>{k.sender}</td>
                        <td className={'default-kudos-table-data'}>{k.title || k.subject}</td>
                        <td className={'default-kudos-table-data'}>{k.message}</td>
                        <td className={'default-kudos-table-data'}>{k.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}


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
