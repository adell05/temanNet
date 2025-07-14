import React from "react";
import Navbar from "../components/Navbar";

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem("temannet_user"));

  const notifications = [
    { id: 1, message: "Akun @johndoe mulai mengikuti kamu.", time: "2 menit lalu" },
    { id: 2, message: "Postingan kamu mendapat 5 like baru.", time: "1 jam lalu" },
    { id: 3, message: "Akun @janedoe mengomentari postingan kamu.", time: "3 jam lalu" },
    { id: 4, message: "Selamat datang di TemanNet!", time: "Kemarin" },
  ];

  return (
    <div className="bg-light min-vh-100 text-dark">
      <Navbar user={user} />

      <div className="container py-4">
        <h3 className="text-warning mb-4">
          <i className="bi bi-bell me-2"></i>Notifikasi
        </h3>

        {notifications.length === 0 ? (
          <p className="text-center text-secondary">Tidak ada notifikasi baru.</p>
        ) : (
          <div className="list-group">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="list-group-item mb-2 rounded shadow-sm d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#ffc107", color: "black" }}
              >
                <div>
                  <i className="bi bi-info-circle me-2 text-dark"></i>
                  {notif.message}
                </div>
                <small className="text-dark">{notif.time}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
