import React, { useState } from "react";
import ImageModal from "./ImageModal";

function ReviewedKudosProf( {reviewedKudos = [], onSelect} ) {
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <section className="sent-kudos">
            <h2>Reviewed Kudos - {reviewedKudos.length}</h2>
            <table>
                <thead>
                <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Kudos Status (Approved, Rejected, Received, etc.)</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {reviewedKudos.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="emptyTable">
                            No Reviewed Kudos yet.
                        </td>
                    </tr>
                ) : (
                    reviewedKudos.map((k, i) => (
                        <tr
                            className={`received-kudos-row ${selectedRows.includes(i) ? "selected-row" : ""}`}
                            key={k.card_id}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                setSelectedRows(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);
                                if(onSelect) onSelect(k);
                            }}
                            onKeyDown={e => {
                                if(e.key === "Enter" || e.key === " ") {
                                    setSelectedRows(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);
                                    if(onSelect) onSelect(k);
                                }
                            }}
                        >
                            <td className={'reviewed-kudos-table-data'}>{k.sender}</td>
                            <td className={'reviewed-kudos-table-data'}>{k.recipient}</td>
                            <td className={'reviewed-kudos-table-data'}>{k.title}</td>

                            <td
                                className={`reviewed-kudos-status ${
                                    k.status === "APPROVED" ? "approved" : "denied"
                                } ${selectedRows.includes(i) ? "row-read" : ""}`}
                            >
                                {k.status === "APPROVED" ? (
                                    <span>Approved</span>
                                ) : (
                                    <>
                                        <span>Rejected:</span>{" "}
                                        {k.professor_note || "No reason provided"}
                                    </>
                                )}
                            </td>

                            <td className={'reviewed-kudos-table-data'}>{k.date}</td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}

export default ReviewedKudosProf;
