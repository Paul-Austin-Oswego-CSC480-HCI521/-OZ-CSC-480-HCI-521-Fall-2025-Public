import React, { useState, useEffect} from 'react';
import ImageModal from "./ImageModal";

function ReceivedKudosStudent() {
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/cards')
        .then((res) => res.json())
        .then((data) => {
            const studentMessages = data.filter(msg => msg.recipientType === 'student');
            setMessages(studentMessages);
        })
        .catch((err) => console.error('Error fetching student kudos:', err));
    }, []);

    const open = (url) => setSelectedImage(url);
    const close = () => setSelectedImage(null);

    return (
        <section className={'received-kudos'}>
            <h2>Received Kudos</h2>

            {messages.length === 0 ? (
                <p style={{ padding: '1rem', fontStyle: 'italic' }}>No Cards Received.</p>
            ) : (
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
                    {messages.map((msg, index) => (
                        <tr
                            key={msg.id || index}
                            className="row-click"
                            role="button"
                            tabIndex={0}
                            onClick={() => open(msg.imageUrl)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") open(msg.imageUrl);
                            }}
                        >
                            <td className={"received-kudos-table-data"}>{msg.sender}</td>
                            <td className={"received-kudos-table-data"}>{msg.title || msg.subject}</td>
                            <td className={"received-kudos-table-data"}>{msg.message || msg.content}</td>
                            <td className={"received-kudos-table-data"}>{msg.date || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>   
            )}
            <ImageModal src={selectedImage} onClose={close} />
        </section>
    );
}

export default ReceivedKudosStudent;