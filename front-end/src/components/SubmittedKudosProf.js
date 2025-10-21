import { useNavigate } from "react-router-dom";

function SubmittedKudosProf({ submitted, onSelect }) {
    const navigate = useNavigate();

    // Navigate to review page when a row is clicked
    const handleRowClick = (kudos) => {
        navigate("/review", { state: { selectedKudos: kudos } });
    };

    return (
        <section className="received-kudos">
            <h2>Submitted Kudos</h2>

            {submitted.length === 0 ? (
                <p style={{ padding: "1rem", fontStyle: "italic" }}>No submitted Kudos yet.</p>
            ) : (
                <table className="k-table">
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
                    {submitted.map((k) => (
                        <tr
                            key={k.card_id}
                            className="row-click"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleRowClick(k)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleRowClick(k);
                                }
                            }}
                        >
                            <td className="default-kudos-table-data">{k.sender}</td>
                            <td className="default-kudos-table-data">{k.recipient}</td>
                            <td className="default-kudos-table-data">{k.title}</td>
                            <td className="default-kudos-table-data">{k.message || k.content}</td>
                            <td className="default-kudos-table-data">{k.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default SubmittedKudosProf;
