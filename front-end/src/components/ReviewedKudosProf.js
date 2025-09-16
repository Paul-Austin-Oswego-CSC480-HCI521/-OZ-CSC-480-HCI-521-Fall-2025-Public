import React from "react";

function SentKudosProf() {
    return (
        <section className ={'sent-kudos'}>
            <h2>Reviewed Kudos</h2>
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
                <tr>
                    <td>Bruce Wayne</td>
                    <td>Clark Kent</td>
                    <td>Stellar Job!</td>
                    <td>Approved</td>
                    <td>9/14/25</td>
                </tr>
                <tr>
                    <td>Optimus Prime</td>
                    <td>Bumblebee</td>
                    <td>Great Work!</td>
                    <td>Rejected: Kudos cards must be obscenity-free</td>
                    <td>9/10/25</td>
                </tr>
                <tr>
                    <td>Leslie Knope</td>
                    <td>Ron Swanson</td>
                    <td>Nice Job!</td>
                    <td>Approved</td>
                    <td>9/10.25</td>
                </tr>
                </tbody>
            </table>
        </section>
    );
}

export default SentKudosProf;