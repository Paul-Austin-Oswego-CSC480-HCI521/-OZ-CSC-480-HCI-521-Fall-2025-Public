// import React, { useState } from "react";
// import "../../styles/Wireframe.css";
// import ConfirmModal from "../CourseManagement/ConfirmModal";
// import ToastMessage from "../Shared/ToastMessage";
// import { authFetch } from "../UserContext";

// function EditClassModal({ open, onClose, classData, onUpdate }) {
//   const [className, setClassName] = useState(classData.class_name);
//   const [endDate, setEndDate] = useState(classData.end_date || "");
//   const [students, setStudents] = useState(classData.students || []);
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [toast, setToast] = useState(null);
//   const [confirmAction, setConfirmAction] = useState(null);

//   const BASE_URL =
//     window.location.hostname === "localhost"
//       ? process.env.REACT_APP_API_BASE_URL
//       : "http://backend:9080/kudo-app/api";

//   const handleRemoveStudent = async (studentId) => {
//     setSubmitting(true);
//     setErrorMessage("");
//     setToast(null);

//     try {
//       const res = await fetch(
//         `${BASE_URL}/class/${classData.class_id}/${studentId}`,
//         { method: "DELETE" }
//       );

//       if (!res.ok) throw new Error("Failed to remove student");
//       setStudents((prev) => prev.filter((s) => s.user_id !== studentId));
//       setToast({ message: "Student removed successfully!", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Failed to remove student.");
//       setToast({ message: "Failed to remove student.", type: "error" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleSave = async () => {
//     setSubmitting(true);
//     setErrorMessage("");
//     setToast(null);

//     try {
//       const res = await authFetch(`${BASE_URL}/class/${classData.class_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           closedAt: endDate ? new Date(endDate).toISOString() : null,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update class info");

//       const updatedClass = await res.json();
//       onUpdate(updatedClass);
//       setToast({ message: "Class info updated!", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Failed to update class info.");
//       setToast({ message: "Failed to update class info.", type: "error" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteClass = async () => {
//     setSubmitting(true);
//     setErrorMessage("");
//     setToast(null);

//     try {
//       const res = await fetch(`${BASE_URL}/class/${classData.class_id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete class");

//       onUpdate({ deleted: true, class_id: classData.class_id });
//       setToast({ message: "Class deleted successfully!", type: "success" });
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Failed to delete class.");
//       setToast({ message: "Failed to delete class.", type: "error" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//   <div className="edit-modal-overlay">
//     <div className="review-page">
//       <div className="header-row">
//         <button onClick={onClose} className="icon-btn">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="m12 19-7-7 7-7" />
//             <path d="M19 12H5" />
//           </svg>
//         </button>
//         <h2>Edit Class</h2>
//       </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSave();
//           }}
//         >
//           <div className="form-group">
//             <label>Class Name</label>
//             <input
//               type="text"
//               className="textBox"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               disabled={submitting}
//             />
//           </div>

//           <div className="form-group">
//             <label>End Date</label>
//             <input
//               type="date"
//               className="textBox"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               disabled={submitting}
//             />
//           </div>

//           <h3>Students</h3>
//           <ul className="student-list">
//             {students.length === 0 && <li>No students enrolled yet.</li>}
//             {students.map((student) => (
//               <li key={student.user_id}>
//                 {student.name} ({student.email})
//                 <button
//                   type="button"
//                   className="submit-btn"
//                   disabled={submitting}
//                   onClick={() =>
//                     setConfirmAction({
//                       type: "removeStudent",
//                       studentId: student.user_id,
//                     })
//                   }
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>

//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//           <div className="button-row">
//             <button type="submit" className="submit-btn" disabled={submitting}>
//               Save
//             </button>
//             <button
//               type="button"
//               className="submit-btn"
//               disabled={submitting}
//               onClick={() => setConfirmAction({ type: "deleteClass" })}
//             >
//               Delete Class
//             </button>
//             <button
//               type="button"
//               className="submit-btn"
//               disabled={submitting}
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>

//         {confirmAction && (
//           <ConfirmModal
//             message={
//               confirmAction.type === "deleteClass"
//                 ? "Are you sure you want to delete this class?"
//                 : "Are you sure you want to remove this student?"
//             }
//             onConfirm={() => {
//               if (confirmAction.type === "deleteClass") handleDeleteClass();
//               else if (confirmAction.type === "removeStudent")
//                 handleRemoveStudent(confirmAction.studentId);
//               setConfirmAction(null);
//             }}
//             onCancel={() => setConfirmAction(null)}
//           />
//         )}

//         {toast && (
//           <ToastMessage
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default EditClassModal;
