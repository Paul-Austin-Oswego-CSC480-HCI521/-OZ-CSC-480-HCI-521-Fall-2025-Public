import React, { useState } from "react";
import ImageModal from "./ImageModal";

function ReviewedKudosProf({ reviewedKudos = [] }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="sent-kudos">
            <h2>Reviewed Kudos</h2>
            {reviewedKudos.length === 0 ? (
                <p style = {{ padding: "1rem", fontStyle: "italic"}}>No Reviewed Kudos Yet.</p>
            ) : (
                <table>
                <thead>
                <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Kudos Status</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {reviewedKudos.map((k, i) => (
                    <tr
                        className={"received-kudos-row"}
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedImage(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedImage(k.imageUrl);
                        }}
                    >
                        <td>{k.sender}</td>
                        <td>{k.recipient}</td>
                        <td>{k.subject || k.title}</td>
                        <td>{k.status}</td>
                        <td>{k.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
            
            <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
        </section>
    );
}

export default ReviewedKudosProf;
