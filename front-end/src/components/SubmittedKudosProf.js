import React, { useState, useEffect } from "react";
import ProfReview from "./ProfReview";
import { useUser } from "./UserContext";

function SubmittedKudosProf({ onReview }) {
    const [submitted, setSubmitted] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [ selectedRows, setSelectedRows] = useState([]);
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleReviewSubmit = async (updatedCard) => {
        try {
            const updatedData = {
            ...updatedCard,
            status: updatedCard.status,
            recipientType: updatedCard.status === "APPROVED" ? "student" : "teacher"};

    await fetch (`${BASE_URL}/kudo-app/api/kudo-card/${updatedCard.card.id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        setSubmitted(prev => prev.filter(card => Number(card.id) !== Number(updatedCard.id)));
        if (onReview) onReview(updatedCard);
        setSelectedRow(null);
        } catch (error) {
            console.error("Error updating kudos:", error);
        }
    };

    useEffect(() => {
        fetch(`${BASE_URL}/kudo-app/api/kudo-card/list/received?user_id=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                const submittedOnly = data.filter(card => 
                    card.status === "SUBMITTED" &&
                    card.recipient === user.name
                );
                setSubmitted(submittedOnly);
            })
            .catch((err) => console.error("Error fetching submitted kudos:", err));
    }, [user]);

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
                            key={k.id || i}
                            className={`row-click${selectedRows.includes(i) ? "selected-row" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                setSelectedRows((prev) =>
                                    prev.includes(i) ? prev.filter((idx) => idx !== i): [...prev, i]
                                );
                                setSelectedRow(k);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSelectedRows(i);
                                    setSelectedRow(k);
                                }
                            }}
                        >
                            <td className="default-kudos-table-data">{k.sender}</td>
                            <td className="default-kudos-table-data">{k.recipient}</td>
                            <td className="default-kudos-table-data">{k.title || k.subject}</td>
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
                    // initialData={{
                    //     sender: selectedRow.sender,
                    //     recipient: selectedRow.recipient,
                    //     subject: selectedRow.subject,
                    //     message:selectedRow.message,
                    //     date:selectedRow.date,
                    // }}
                    readOnly={false}
                    onClose={() => setSelectedRow(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </section>
    );
}

export default SubmittedKudosProf;
