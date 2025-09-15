import React, { useState } from "react";
import ImageModal from "./ImageModal";

const submitted = [
    {
        sender: "John Doe",
        recipient: "Jane Smith",
        title: "Excellent Work!",
        message:
            "I thought you did a great job with the log-in page. It looks sleek and me...",
        imageUrl: "/img/logo192.png",
    },
];

function ReceivedKudosProf() {
    const [selectedImage, setSelectedImage] = useState(null);
    const open = (url) => setSelectedImage(url);
    const close = () => setSelectedImage(null);

    return (
        <section>
            <h2>Submitted Kudos</h2>
            <table className="k-table">
                <thead>
                <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                {submitted.map((k, i) => (
                    <tr
                        key={i}
                        className="row-click"
                        role="button"
                        tabIndex={0}
                        onClick={() => open(k.imageUrl)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") open(k.imageUrl);
                        }}
                    >
                        <td><strong>{k.sender}</strong></td>
                        <td><strong>{k.recipient}</strong></td>
                        <td><strong>{k.title}</strong></td>
                        <td><strong>{k.message}</strong></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ImageModal src={selectedImage} onClose={close} />
        </section>
    );
}

export default ReceivedKudosProf;
