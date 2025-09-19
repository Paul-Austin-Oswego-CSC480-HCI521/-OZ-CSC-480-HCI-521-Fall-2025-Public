import React, { useState, useEffect } from "react";
import ProfReview from "./ProfReview";

function SubmittedKudosProf({ onReview }) {
    const [submitted, setSubmitted] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleReviewSubmit = (updatedCard) => {
        setSubmitted(prev => prev.filter(card => card.id != updatedCard.id));
        if (onReview) onReview(updatedCard);
        setSelectedRow(null);
    };

    useEffect(() => {
        fetch("http://localhost:3001/cards?recipientType=teacher")
            .then((res) => res.json())
            .then((data) => setSubmitted(data))
            .catch((err) => console.error("Error fetching submitted kudos:", err));
    }, []);

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
                            className="row-click"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedRow(k)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelectedRow(k);
                            }}
                        >
                            <td className="submitted-kudos-table-data">{k.sender}</td>
                            <td className="submitted-kudos-table-data">{k.recipient}</td>
                            <td className="submitted-kudos-table-data">{k.title || k.subject}</td>
                            <td className="submitted-kudos-table-data">{k.message || k.content}</td>
                            <td className="submitted-kudos-table-data">{k.date || "-"}</td>
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
