import React, { useState, useEffect } from "react";

function SentKudosStudent() {
    const [messages, setMessages] = useState([]);
    
        useEffect(() => {
            fetch('http://localhost:3001/cards?senderType=student')
            .then((res) => res.json())
            .then((data) => {
                const studentCards = data.filter(card => card.senderType === "student");
                setMessages(studentCards);
            })
            .catch((err) => console.error('Error fetching student kudos:', err));
        }, []);
    
        return (
            <section className={'sent-kudos'}>
                <h2>Sent Kudos</h2>
    
                {!messages || messages.length === 0 ? (
                    <p style={{ padding: '1rem', fontStyle: 'italic' }}>No Cards Sent.</p>
                ) : (
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
                        {messages.map((msg, index) => (
                            <tr key={msg.id || index}>
                                <td><strong>{msg.recipient}</strong></td>
                                <td>{msg.subject || msg.title}</td>
                                <td>{msg.status}</td>
                                <td>{msg.date || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>   
                )}
            </section>
        );
    }

export default SentKudosStudent;