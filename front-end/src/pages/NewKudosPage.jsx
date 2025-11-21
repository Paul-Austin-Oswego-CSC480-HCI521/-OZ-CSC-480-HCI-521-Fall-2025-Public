import React, { useState, useEffect } from 'react';
import { useUser, authFetch } from '../components/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Wireframe.css';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AutoFitText from '../components/AutoFitText';

function NewKudosPage({ onSubmit }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const queryParams = new URLSearchParams(location.search);
    const editCardId = queryParams.get('edit');

    const [rosters, setRosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);

    const titleOptions = ['Well Done!', 'Nice Job!', 'Great Work!'];
    const imageMap = {
        'Well Done!': '/images/wellDoneNew.png',
        'Nice Job!': '/images/niceJobNew.png',
        'Great Work!': '/images/greatWorkNew.png',
    };

    const [selectedImage, setSelectedImage] = useState(imageMap[titleOptions[0]]);
    const [formData, setFormData] = useState({
        recipient: '',
        class: '',
        title: titleOptions[0],
        message: '',
    });

    useEffect(() => {
        authFetch(`${BASE_URL}/users/${user.user_id}/classes`)
            .then(res => res.json())
            .then(async (data) => {
                const classProm = data.class_id.map(async (classId) => {
                    const res = await authFetch(`${BASE_URL}/class/${classId}`);
                    const data = await res.json();
                    return { id: classId, name: data.class[0].class_name };
                });
                const classList = await Promise.all(classProm);
                setClasses(classList);

                if (classList.length === 1) {
                    setFormData(prev => ({ ...prev, class: classList[0].id }));
                }

                const rostersProm = classList.map(async (c) => {
                    const res = await authFetch(`${BASE_URL}/class/${c.id}/users`);
                    const data = await res.json();
                    const roster = data.filter(student => student.id !== user.user_id);
                    return { id: c.id, name: c.name, roster: roster };
                });
                const rosters = await Promise.all(rostersProm);
                setRosters(rosters);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load class and roster data:", err);
                setLoading(false);
            });
    }, [BASE_URL, user?.user_id]);

    useEffect(() => {
        if (!editCardId) return;

        const fetchCardForEdit = async () => {
            try {
                const res = await authFetch(`${BASE_URL}/kudo-card/${editCardId}?user_id=${user.user_id}`);
                if (!res.ok) throw new Error("Failed to load card for editing");
                const card = await res.json();

                setFormData({
                    recipient: card.recipient_id,
                    class: card.class_id,
                    title: card.title,
                    message: card.content,
                });

                if (imageMap[card.title]) setSelectedImage(imageMap[card.title]);
            } catch (err) {
                console.error("Error loading card for editing:", err);
            }
        };

        fetchCardForEdit();
    }, [editCardId, BASE_URL, user?.user_id]);

    const handleCreateNew = () => {
        const base = location.pathname.includes("studentView")
            ? "/studentView/new-kudos"
            : "/professorView/new-kudos";
        navigate(base);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'class' ? { recipient: '' } : {})
        }));
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const incoming = pastedText.trim();
        setFormData(prev => {
            const current = prev.message;
            const spaceLeft = 500 - current.length;
            const clipped = incoming.slice(0, Math.max(spaceLeft, 0));
            return { ...prev, message: current + clipped };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert("User not loaded yet.");
            return;
        }

        if (formData.message.length < 10 || formData.message.length > 500) {
            alert("Your message must be between 10 and 500 characters.");
            return;
        }

        const payload = {
            card_id: editCardId || uuidv4(),
            sender_id: user.user_id,
            recipient_id: formData.recipient,
            class_id: formData.class,
            title: formData.title,
            content: formData.message,
            status: "PENDING",
            approvedBy: null
        };

        const method = editCardId ? "PUT" : "POST";
        const endpoint = editCardId
            ? `${BASE_URL}/kudo-card/${editCardId}`
            : `${BASE_URL}/kudo-card`;

        authFetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to submit Kudo");
                return res.json();
            })
            .then(() => {
                console.log(editCardId ? "Kudo updated" : "Kudo created");
                navigate('/home');
                setFormData({
                    recipient: '',
                    class: '',
                    title: titleOptions[0],
                    message: ''
                });
                setSelectedImage(imageMap[titleOptions[0]]);
            })
            .catch(err => console.error("Submission failed:", err));
    };

    if (loading) return <div className="app-container">Loading...</div>;

    if (!loading && classes.length === 0) {
        return (
            <div className="app-container">
                <Header onCreateNew={handleCreateNew} />
                <div className="main-content no-classes-container">
                    <h2>You haven’t joined any classes yet!</h2>
                    <p>
                        Click the 'Add Course' button and type in your instructor-provided join code to join a class and start sending Kudos.
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container">
            <title>Create Kudos Card</title>
            <Header onCreateNew={handleCreateNew} />
            <div className="main-content">

                <div className="create-new-header">
                    <button type='button' className='back-button' onClick={() => navigate(-1)}>←</button>
                    <h2>{editCardId ? "Edit & Resend Kudo" : "Create a Kudos Card"}</h2>
                </div>

                <form onSubmit={handleSubmit} className="kudos-form">
                    <div className="message-image-container">

                        <div className="left-column">


                            <div className="form-group">

                                <div className="from-group">
                                    <label htmlFor="title">Choose a Title</label>
                                    <div className="title-options-full">
                                    {titleOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`title-button-CC ${formData.title === option ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, title: option }));
                                                const img = imageMap[option];
                                                if (img) setSelectedImage(img);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                    </div>
                                </div>

                                <div className="form-group" >
                                    <label htmlFor="class">Select a Class</label>
                                    <select
                                        id="class"
                                        className="to-from-title"
                                        name="class"
                                        value={formData.class}
                                        required
                                        onChange={handleChange}
                                    >
                                        <option value=""> -- Select a Class --</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group" >
                                    <label htmlFor="recipient">Recipient</label>
                                    <select
                                        id="recipient"
                                        className="to-from-title"
                                        name="recipient"
                                        value={formData.recipient}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.class}
                                    >
                                        <option value=""> -- Select a recipient --</option>
                                        {(rosters.find((r) => r.id === formData.class)?.roster || []).map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>

                                </div>

                                <div className="message-box">
                                    <label htmlFor="message">Your Message</label>
                                    <textarea
                                        id="message"
                                        className="textBox"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onPaste={handlePaste}
                                        placeholder="Please enter a message"
                                        rows={5}
                                        minLength={10}
                                        maxLength={500}
                                        required
                                    />
                                    <div className="message-footer">
                                        <span
                                            className="char-count"
                                            style={{
                                                textAlign: 'right',
                                                fontSize: '0.9em',
                                                color:
                                                    formData.message.length < 10 || formData.message.length > 500
                                                        ? 'red'
                                                        : '#555',
                                            }}
                                        >
                                            {formData.message.length}/500
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="right-column-div">

                            <div className="right-column" >
                                {selectedImage && (
                                    <div className="image-preview-container-img">
                                        <img src={selectedImage} alt={formData.title} style={{ width: '100%' }} />
                                        <div className="message-preview-container">
                                            <AutoFitText
                                                text={formData.message || "Your message will appear here..."}
                                                maxFontSize={32}
                                                minFontSize={10}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="button-row">
                                <button type="submit" className="submit-discard-btn">
                                    {editCardId ? "Resend Kudo" : "Send Kudo"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                                        viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        className="lucide lucide-send">
                                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                                        <path d="m21.854 2.147-10.94 10.939"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="submit-discard-btn"
                                    onClick={() => {
                                        const sure = window.confirm("Discard this Kudo? Your message will be lost.");
                                        if (sure) navigate(-1);
                                    }}
                                >
                                    Discard
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default NewKudosPage;
