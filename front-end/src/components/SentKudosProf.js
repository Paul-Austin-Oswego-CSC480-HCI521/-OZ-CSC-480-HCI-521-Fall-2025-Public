import React from "react";

function SentKudosProf() {
    return (
        <section>
            <h2>Reviewed Kudos</h2>
            <table>
                <thead>
                <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>Kudos Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Optimus Prime</td>
                    <td>Bumblebee</td>
                    <td>Rejected: Kudos cards must be obscenity-free</td>
                </tr>
                <tr>
                    <td>Leslie Knope</td>
                    <td>Ron Swanson</td>
                    <td>Approved</td>
                </tr>
                </tbody>
            </table>
        </section>
    );
}

export default SentKudosProf;