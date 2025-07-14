import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function HelpSupport() {
  const user = JSON.parse(localStorage.getItem("temannet_user"));
  
  const questions = [
    {
      question: "Bagaimana cara mengubah foto profil?",
      answer: "Kamu bisa mengubah foto profil dengan masuk ke halaman Profil, lalu klik foto profil dan pilih foto baru."
    },
    {
      question: "Bagaimana cara mencari akun teman?",
      answer: "Gunakan kolom pencarian di bagian atas halaman untuk mencari nama atau email teman kamu."
    },
    {
      question: "Bagaimana cara keluar dari akun?",
      answer: "Klik foto profil di kanan atas, lalu pilih opsi 'Keluar' untuk keluar dari akun kamu."
    }
  ];

  const [openStates, setOpenStates] = useState(Array(questions.length).fill(false));

  const toggleQuestion = (index) => {
    const newStates = [...openStates];
    newStates[index] = !newStates[index];
    setOpenStates(newStates);
  };

  return (
    <div className="bg-light min-vh-100 text-dark">
      <Navbar user={user} />

      <div className="container py-4">
        <h3 className="text-warning mb-4">
          <i className="bi bi-question-circle-fill me-2"></i>Help & Support
        </h3>

        <div className="mb-4">
          <h5 className="text-dark">Tentang TemanNet</h5>
          <p>
            TemanNet adalah platform media sosial sederhana untuk terhubung dengan teman, berbagi cerita, dan menjalin relasi baru. Jika kamu mengalami kendala atau punya pertanyaan, silakan lihat bantuan di bawah ini.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-dark">Pertanyaan Umum</h5>
          <div className="border rounded overflow-hidden">
            {questions.map((item, index) => (
              <div key={index} className="border-bottom">
                <div
                  className="d-flex justify-content-between align-items-center p-3"
                  style={{ backgroundColor: "#ffc107", cursor: "pointer" }}
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="fw-bold">{item.question}</span>
                  <span>{openStates[index] ? "▲" : "▼"}</span>
                </div>
                {openStates[index] && (
                  <div className="p-3 bg-white text-dark border-top">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-dark">Kontak Bantuan</h5>
          <p>
            Jika pertanyaanmu tidak terjawab di atas, hubungi tim kami melalui:
          </p>
          <ul>
            <li>Email: support@temannet.com</li>
            <li>WhatsApp: +62 812-3456-7890</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
