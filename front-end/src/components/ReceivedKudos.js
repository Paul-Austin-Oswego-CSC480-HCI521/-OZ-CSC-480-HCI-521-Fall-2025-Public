// Possibly unused code

// import React, { useState, useEffect } from "react";
// import ImageModal from "./ImageModal";

// function ReceivedKudos() {
//     const [received, setReceived] = useState([]);
//     const [selectedImage, setSelectedImage] = useState(null);

//     useEffect(() => {
//         fetch("http://localhost:3001/cards")
//         .then((res) => res.json())
//         .then((data) => setReceived(data))
//         .catch((err) => console.error("Error fetching kudos:", err));
//     }, []);

//     const open = (url) => setSelectedImage(url);
//     const close = () => setSelectedImage(null);

//     return (
//         <section>
//             <h2>Received Kudos</h2>
//             <table className="k-table">
//                 <thead>
//                     <tr>
//                         <th>Sender</th>
//                         <th>Title</th>
//                         <th>Message</th>
//                         <th>Date</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                 {received.map((kudo, i) => (
//                     <tr
//                         key={kudo.id || i}
//                         className="row-click"
//                         role="button"
//                         tabIndex={0}
//                         onClick={() => open(kudo.imageUrl)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" || e.key === " ") open(kudo.imageUrl);
//                         }}
//                     >
//                         <td><strong>{kudo.sender}</strong></td>
//                         <td>{kudo.subject}</td>
//                         <td className="truncate">{kudo.content || kudo.message}</td>
//                         <td>{kudo.date || "-"}</td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>

//             <ImageModal src={selectedImage} onClose={close} />
//         </section>
//     );
// }

// export default ReceivedKudos;
