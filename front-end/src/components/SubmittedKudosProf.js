import React, { useState } from 'react';

function SubmittedKudosProf({ submitted, onSelect}) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [readKudos, setReadKudos] = useState([]);

    return (
        <section className="received-kudos">
            <h2>Submitted Kudos - {submitted.length}</h2>

            <div className="table-container">
                <table>
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
                    {submitted.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="emptyTable">No Kudos to Review.</td>
                        </tr>
                    ) : (
                        submitted.map((k) => (
                                <tr
                                    key={k.card_id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        setSelectedRows((prev) =>
                                        prev.includes(k.card_id) ? prev : [...prev, k.card_id]
                                    );
                                    onSelect(k);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setSelectedRows((prev) =>
                                                prev.includes(k.card_id) ? prev : [...prev, k.card_id]);
                                            onSelect(k);
                                        }
                                    }}
                                    className={selectedRows.includes(k.card_id) ? "selected-row" : ""}
                                >
                                    <td className='default-kudos-table-data'>
                                        {!selectedRows.includes(k.card_id) && <span className="unread-indicator"/>}
                                        {k.sender}
                                    </td>
                                    <td className={`default-kudos-table-data`}>{k.recipient}</td>
                                    <td className={`default-kudos-table-data`}>{k.title}</td>
                                    <td className={`default-kudos-table-data`}>{k.message || k.content}</td>
                                    <td className={`default-kudos-table-data`}>{k.date}</td>
                                </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default SubmittedKudosProf;
