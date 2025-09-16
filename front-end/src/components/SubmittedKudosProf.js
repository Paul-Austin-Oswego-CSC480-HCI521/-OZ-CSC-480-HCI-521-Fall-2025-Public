import React, { useState, useEffect } from "react";
import ImageModal from "./ImageModal";

function ReceivedKudosProf() {
    const [submitted, setSubmitted] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/cards?recipientType=teacher")
        .then((res) => res.json())
        .then((data) => setSubmitted(data))
        .catch((err) => console.error("Error fetching submitted kudos:", err));
    }, []);

    const open = (url) => setSelectedImage(url);
    const close = () => setSelectedImage(null);

    return (
        <section className = {'received-kudos'}>
            <h2>Submitted Kudos</h2>

            {submitted.length === 0 ? (
                <p style={{ padding: '1rem', fontStyle: 'italic' }}>No Cards Submitted.</p>
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
                        onClick={() => open(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") open(k.imageUrl);
                        }}
                    >
                        <td className={"submitted-kudos-table-data"}>{k.sender}</td>
                        <td className={"submitted-kudos-table-data"}>{k.recipient}</td>
                        <td className={"submitted-kudos-table-data"}>{k.title || k.subject}</td>
                        <td className={"submitted-kudos-table-data"}>{k.message || k.content}</td>
                        <td className={"submitted-kudos-table-data"}>{k.date || "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
            <ImageModal src={selectedImage} onClose={close} />
        </section>
    );
}

export default ReceivedKudosProf;
