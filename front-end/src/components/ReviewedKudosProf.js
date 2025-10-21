import React, { useState } from "react";
import ImageModal from "./ImageModal";

function ReviewedKudosProf( {reviewedKudos = []} ) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const safeReviewedKudos = Array.isArray(reviewedKudos) ? reviewedKudos : [];

    return (
        <section className="sent-kudos">
            <h2>Reviewed Kudos</h2>
            {safeReviewedKudos.length === 0 ? (
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
                        className={`received-kudos-row ${selectedRows.includes(i) ? "selected-row" : ""}`}
                        key={k.card_id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            setSelectedRows((prev) =>
                                prev.includes(i) ? prev.filter((idx) => idx !== i): [...prev, i]
                            );
                            setSelectedImage(k.imageUrl);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSelectedRows((prev) => 
                                    prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]);
                                setSelectedImage(k.imageUrl);
                            }
                        }}
                    >
                        <td className={'default-kudos-table-data'}>{k.sender}</td>
                        <td className={'default-kudos-table-data'}>{k.recipient}</td>
                        <td className={'default-kudos-table-data'}>{k.title}</td>
                        <td className={'default-kudos-table-data'}>{k.status}</td>
                        <td className={'default-kudos-table-data'}>{k.date}</td>
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
