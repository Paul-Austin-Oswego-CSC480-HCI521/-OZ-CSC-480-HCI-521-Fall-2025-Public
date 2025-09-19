import React, { useEffect } from 'react';
import '../styles/Wireframe.css';

function Notification({ open, onClose, items = [] }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="notif-title">
            <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
                <div className="notif-header">
                    <h4 id="notif-title">Notifications</h4>
                    <button className="close-btn" onClick={onClose} aria-label="Close">✖</button>
                </div>

                {items.length === 0 ? (
                    <p className="notif-empty">No new notifications.</p>
                ) : (
                    <ul className="notif-list">
                        {items.map((n) => (
                            <li key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                                <div className="notif-title">{n.title}</div>
                                {n.message && <div className="notif-message">{n.message}</div>}
                                {n.time && <div className="notif-time">{n.time}</div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Notification;
