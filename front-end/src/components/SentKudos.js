import React from "react";

function SentKudos() {
    return(
        <section className="sent-kudos">
            <h3>Sent Kudos</h3>
            <div className="kudos-list-header">
                <span>Kudos Title</span>
                <span>Kudos Text</span>
                <span>Kudos Status</span>
            </div>
            <div className="kudos-box">
                {/* Sent Kudos content goes here */}
            </div>
        </section>
    )
}

export default SentKudos;