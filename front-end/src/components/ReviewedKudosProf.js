import React, { useState } from "react";
import ImageModal from "./ImageModal";

const reviewed = [
    {
        sender: "Bruce Wayne",
        recipient: "Clark Kent",
        title: "Stellar Job!",
        status: "Approved",
        date: "9/14/25",
        imageUrl: "/img/logo192.png",
    },
    {
        sender: "Optimus Prime",
        recipient: "Bumblebee",
        title: "Great Work!",
        status: "Rejected: Kudos cards must be obscenity-free",
        date: "9/10/25",
        imageUrl: "/img/logo192.png",
    },
    {
        sender: "Leslie Knope",
        recipient: "Ron Swanson",
        title: "Nice Job!",
        status: "Approved",
        date: "9/10/25",
        imageUrl: "/img/logo192.png",
    },
];

function ReviewedKudosProf() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="sent-kudos">
            <h2>Reviewed Kudos</h2>
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
                {reviewed.map((k, i) => (
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
                        <td className={'received-kudos-table-data'}>{k.sender}</td>
                        <td className={'received-kudos-table-data'}>{k.recipient}</td>
                        <td className={'received-kudos-table-data'}>{k.title}</td>
                        <td className={'received-kudos-table-data'}>{k.status}</td>
                        <td className={'received-kudos-table-data'}>{k.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
        </section>
    );
}

export default ReviewedKudosProf;
