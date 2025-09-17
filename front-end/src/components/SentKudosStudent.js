import React, { useState } from "react";

const sent = [
    {
        recipient: "Abraham Lincoln",
        title: "Fantastic Effort!",
        status: "Received",
        date:"9/13/25",
        imageUrl: "/img/logo192.png",
    },
];

function SentKudosStudent() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="sent-kudos">
            <h2>Sent Kudos</h2>
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
                {sent.map((k, i) => (
                    <tr
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedImage(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedImage(k.imageUrl);
                        }}
                    >
                        <td className={'received-kudos-table-data'}>{k.recipient}</td>
                        <td className={'received-kudos-table-data'}>{k.title}</td>
                        <td className={'received-kudos-table-data'}>{k.status}</td>
                        <td className={'received-kudos-table-data'}>{k.date}</td>
                    </tr>
                ))}
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
