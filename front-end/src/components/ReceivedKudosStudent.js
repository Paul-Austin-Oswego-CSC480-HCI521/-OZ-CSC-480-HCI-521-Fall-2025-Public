import React, { useState } from "react";

const received = [
    {
        sender: "Bill Gates",
        title: "Totally Awesome!",
        message: "Great work on your project!",
        date: "9/13/25",
        imageUrl: "/img/logo192.png",
    },
];

function ReceivedKudosStudent() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="received-kudos">
            <h2>Received Kudos</h2>
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
                        onClick={() => setSelectedImage(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedImage(k.imageUrl);
                        }}
                    >
                        <td className={'submitted-kudos-table-data'}>{k.sender}</td>
                        <td className={'submitted-kudos-table-data'}>{k.title}</td>
                        <td className={'submitted-kudos-table-data'}>{k.message}</td>
                        <td className={'submitted-kudos-table-data'}>{k.date}</td>
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

export default ReceivedKudosStudent;
