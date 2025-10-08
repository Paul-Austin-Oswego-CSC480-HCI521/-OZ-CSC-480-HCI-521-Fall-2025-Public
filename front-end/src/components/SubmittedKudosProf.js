import React, { useState, useEffect } from "react";
import ProfReview from "./ProfReview";
import { useUser } from "./UserContext";

function SubmittedKudosProf({ onReview }) {
    const [submitted, setSubmitted] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    // const [selectedRows, setSelectedRows] = useState([]);
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleReviewSubmit = async (updatedCard) => {
        try {
            const updatedData = {
            ...updatedCard,
            status: updatedCard.status,
            approvedBy: user.user_id
            // shouldn't need to update recipientType because user.role stores the type,
            // and new logic means students will only see kudos with themselves as the recipient that have been approved, 
            // or themselves as the sender
        };

        await fetch (`${BASE_URL}/kudo-app/api/kudo-card/${updatedCard.card_id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        setSubmitted((prev) => prev.filter((card) => card.card_id !== updatedCard.card_id));
        if (onReview) onReview(updatedCard);
        setSelectedRow(null);
        } catch (error) {
            console.error("Error updating kudos:", error);
        }
    };

    useEffect(() => {
        if (!user) return;

        async function fetchSubmittedKudos() {
            try {
                const res = await fetch(
                    `${BASE_URL}/kudo-app/api/kudo-card/list/received?user_id=${user.user_id}`);

                    if (!res.ok) throw new Error("Failed to fetch submitted kudos");

                    const data = await res.json();
                    const submittedOnly = data.filter(
                        (card) => card.status === "SUBMITTED" && 
                        Array.isArray(user.classes) &&
                        user.classes.map(cls => cls.class_id).includes(card.class_id)
                        // && card.recipient_id === user.userId
                        );
                    setSubmitted(submittedOnly);
            } catch (err) {
                console.error("Error fetching submitted kudos:", err);
            }
        }
        
        fetchSubmittedKudos();
    }, [user, BASE_URL]);

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <section className="received-kudos">
            <h2>Submitted Kudos</h2>

            {submitted.length === 0 ? (
                <p style={{ padding: "1rem", fontStyle: "italic" }}>No Cards Submitted.</p>
            ) : (
                <table className="k-table">
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
                    {submitted.map((k, i) => (
                        <tr
                            key={k.card_id || i}
                            className={`row-click${selectedRow?.card_id === k.card_id ? "selected-row" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedRow(k)}
                            //     setSelectedRows((prev) =>
                            //         prev.includes(i) ? prev.filter((idx) => idx !== i): [...prev, i]
                            //     );
                            //     setSelectedRow(k);
                            // }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    // setSelectedRows(i);
                                    setSelectedRow(k);
                                }
                            }}
                        >
                            <td className="default-kudos-table-data">{k.sender_id}</td>
                            <td className="default-kudos-table-data">{k.recipient_id}</td>
                            <td className="default-kudos-table-data">{k.title}</td>
                            <td className="default-kudos-table-data">{k.message || k.content}</td>
                            <td className="default-kudos-table-data">{k.date || "-"}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedRow && (
                <ProfReview
                    initialData={selectedRow}
                    readOnly={false}
                    onClose={() => setSelectedRow(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </section>
    );
}

export default SubmittedKudosProf;
