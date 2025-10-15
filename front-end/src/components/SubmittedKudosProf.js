import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

function SubmittedKudosProf() {
    const [submitted, setSubmitted] = useState([]);
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    // Fetch submitted kudos from API
    useEffect(() => {
        if (!user) return;

        async function fetchSubmittedKudos() {
            try {
                const res = await fetch(
                    `${BASE_URL}/kudo-app/api/kudo-card/list/received?user_id=${user.user_id}`
                );

                if (!res.ok) throw new Error("Failed to fetch submitted kudos");

                const data = await res.json();
                const submittedOnly = data.filter(
                    (card) =>
                        card.status === "SUBMITTED" &&
                        Array.isArray(user.classes) &&
                        user.classes.map(cls => cls.class_id).includes(card.class_id)
                );
                setSubmitted(submittedOnly);
            } catch (err) {
                console.error("Error fetching submitted kudos:", err);
            }
        }

        fetchSubmittedKudos();
    }, [user, BASE_URL]);

    // Navigate to review page when a row is clicked
    const handleRowClick = (kudos) => {
        navigate("/review", { state: { selectedKudos: kudos } });
    };

    return (
        <section className="received-kudos">
            <h2>Submitted Kudos</h2>

            {submitted.length === 0 ? (
                <p style={{ padding: "1rem", fontStyle: "italic" }}>No submitted Kudos yet.</p>
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
                    {submitted.map((k) => (
                        <tr
                            key={k.card_id}
                            className="row-click"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleRowClick(k)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleRowClick(k);
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
        </section>
    );
}

export default SubmittedKudosProf;
