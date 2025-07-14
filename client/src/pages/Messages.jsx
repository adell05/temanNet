import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Picker from "emoji-picker-react";

export default function Messages() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("temannet_user"));
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
      fetchFriends(userData._id);
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedContact && user) {
      fetchMessages(user._id, selectedContact._id);
    }
  }, [selectedContact, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchFriends = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/friends/${userId}`);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (userId, friendId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}/${friendId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !isRecording) || !selectedContact) return;
    try {
      const res = await axios.post("http://localhost:5000/api/messages", {
        sender: user._id,
        receiver: selectedContact._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
      setShowEmojiPicker(false);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        sendAudioMessage(blob);
      };

      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  const sendAudioMessage = async (audioBlob) => {
    if (!selectedContact) return;

    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("receiver", selectedContact._id);
    formData.append("audio", audioBlob, "audio.webm");

    try {
      const res = await axios.post("http://localhost:5000/api/messages/audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages([...messages, res.data]);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar user={user} />

      <div className="container-fluid flex-grow-1 d-flex mt-3" style={{ minHeight: "calc(100vh - 70px)" }}>
        
        {/* Sidebar Kontak */}
        <div className="border-end d-flex flex-column" style={{ width: "30%", backgroundColor: "#fff" }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Pesan</h5>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {contacts.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center text-center px-3 mt-5">
                <i className="bi bi-person-plus fs-1 mb-2 text-warning"></i>
                <h6 className="fw-bold text-dark">Belum ada teman</h6>
                <p className="text-muted mb-3">Cari & tambahkan teman untuk mulai percakapan</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`d-flex align-items-center p-3 border-bottom ${selectedContact?._id === contact._id ? "bg-light" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div onClick={(e) => { e.stopPropagation(); goToProfile(contact._id); }} style={{ cursor: "pointer" }}>
                    {contact.photo ? (
                      <img
                        src={`http://localhost:5000${contact.photo}`}
                        alt="avatar"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center text-secondary me-2"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#e9ecef",
                          fontSize: "1.4rem",
                        }}
                      >
                        <i className="bi bi-person-circle"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">{contact.username}</h6>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Area Chat */}
        <div className="d-flex flex-column flex-grow-1" style={{ backgroundColor: "#fff" }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">
              {selectedContact ? selectedContact.username : "Pilih Percakapan"}
            </h5>
          </div>

          <div className="flex-grow-1 overflow-auto d-flex flex-column px-3 py-2">
            {selectedContact ? (
              <>
                {messages.map((msg) => (
                  <div key={msg._id} className={`mb-2 d-flex ${msg.sender === user._id ? "justify-content-end" : "justify-content-start"}`}>
                    <div
                      className="p-2 rounded text-dark"
                      style={{
                        backgroundColor: msg.sender === user._id ? "#ffff66" : "#ffa500",
                        maxWidth: "75%",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.audio ? (
                        <audio controls src={`http://localhost:5000${msg.audio}`}></audio>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
                <i className="bi bi-chat-dots-fill text-warning mb-3" style={{ fontSize: "3rem" }}></i>
                <h6 className="fw-bold text-dark">Mulai Berkomunikasi</h6>
                <p className="text-muted">Pilih teman untuk mulai percakapan</p>
              </div>
            )}
          </div>

          <div className="border-top p-3" style={{ backgroundColor: "#f8f9fa" }}>
            {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
            <div className="d-flex align-items-center">
              <i
                className="bi bi-emoji-smile me-2 fs-5 text-warning"
                style={{ cursor: "pointer" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              ></i>

              <input
                type="text"
                className="form-control me-2"
                placeholder="Tulis pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={!selectedContact}
              />

              {isRecording ? (
                <i className="bi bi-stop-circle fs-5 me-2 text-danger" style={{ cursor: "pointer" }} onClick={stopRecording}></i>
              ) : (
                <i
                  className="bi bi-mic fs-5 me-2 text-warning"
                  style={{ cursor: selectedContact ? "pointer" : "not-allowed" }}
                  onClick={() => selectedContact && startRecording()}
                ></i>
              )}

              <i
                className="bi bi-send fs-5 text-warning"
                style={{ cursor: selectedContact ? "pointer" : "not-allowed" }}
                onClick={sendMessage}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
