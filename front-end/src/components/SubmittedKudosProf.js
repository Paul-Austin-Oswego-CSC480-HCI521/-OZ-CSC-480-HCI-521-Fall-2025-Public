import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

function SubmittedKudosProf() {
    const [submitted, setSubmitted] = useState([
        {
            card_id: 101,
            sender_id: "student001",
            recipient_id: "profA",
            title: "Great Lecture",
            message: "Thanks for making class engaging and fun!",
            date: "2025-10-05",
            status: "SUBMITTED",
            class_id: 101
        },
        {
            card_id: 102,
            sender_id: "student002",
            recipient_id: "profA",
            title: "Helpful Office Hours",
            message: "I really appreciated your time after class last week.",
            date: "2025-10-07",
            status: "SUBMITTED",
            class_id: 101
        },
        {
            card_id: 103,
            sender_id: "student003",
            recipient_id: "profB",
            title: "Awesome Feedback",
            message: "Your project feedback really helped me improve!",
            date: "2025-10-09",
            status: "SUBMITTED",
            class_id: 202
        },
        {
            card_id: 104,
            sender_id: "student004",
            recipient_id: "profC",
            title: "Supportive Guidance",
            message: "Thanks for helping me understand the project requirements!",
            date: "2025-10-10",
            status: "SUBMITTED",
            class_id: 303
        },
        {
            card_id: 105,
            sender_id: "student005",
            recipient_id: "profA",
            title: "Excellent Examples",
            message: "The examples in class really helped me grasp the concepts.",
            date: "2025-10-11",
            status: "SUBMITTED",
            class_id: 101
        }
    ]);
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
