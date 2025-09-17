import React, { useState } from "react";

const received = [
    {
        sender: "John Doe",
        recipient: "Jane Smith",
        title: "Excellent Work!",
        message: "I thought you did a great job with the log-in page. It looks sleek and me...",
        imageUrl: "/img/logo192.png",
    },
];

function ReceivedKudosProf() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="received-kudos">
            <h2>Submitted Kudos</h2>
            <table>
                <thead>
                <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                {received.map((k, i) => (
                    <tr
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedImage(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedImage(k.imageUrl);
                        }}
                    >
                        <td><strong>{k.sender}</strong></td>
                        <td><strong>{k.recipient}</strong></td>
                        <td><strong>{k.title}</strong></td>
                        <td>{k.message}</td>
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

export default ReceivedKudosProf;
