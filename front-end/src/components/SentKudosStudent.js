import React from "react";

function SentKudosStudent() {
    return (
        <section>
            <h2>Sent Kudos</h2>
            <table>
                <thead>
                <tr>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Kudos Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Abraham Lincoln</td>
                    <td>Fantastic Effort!</td>
                    <td>Received</td>
                </tr>
                </tbody>
            </table>
        </section>
    );
}

export default SentKudosStudent;