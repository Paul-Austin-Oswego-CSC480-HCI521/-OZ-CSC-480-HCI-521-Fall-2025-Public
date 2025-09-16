// Possibly unused code

// import React, { useState } from "react";
// import ImageModal from "./ImageModal";

// function SentKudos() {
//     const [selectedImage, setSelectedImage] = useState(null);

//     const open = (url) => setSelectedImage(url);
//     const close = () => setSelectedImage(null);

//     return (
//         <section className ={'sent-kudos'}>
//             <h2>Sent Kudos</h2>
//             <table className="k-table">
//                 <thead>
//                 <tr>
//                     <th>Recipient</th>
//                     <th>Title</th>
//                     <th>Kudos Status</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {sent.map((k, i) => (
//                     <tr
//                         key={i}
//                         className="row-click"
//                         role="button"
//                         tabIndex={0}
//                         onClick={() => open(k.imageUrl)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" || e.key === " ") open(k.imageUrl);
//                         }}
//                     >
//                         <td>{k.recipient}</td>
//                         <td>{k.title}</td>
//                         <td>{k.status}</td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>

//             <ImageModal src={selectedImage} onClose={close} />
//         </section>
//     );
// }

// export default SentKudos;
