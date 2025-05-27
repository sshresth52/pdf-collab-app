import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Pages
import FileList from "./pages/FileList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SharedView from "./pages/SharedView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [user, setUser] = useState(null);

  // 🔁 Check user session on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file");
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadStatus("Only PDF files are allowed.");
      return;
    }

    if (!user) {
      setUploadStatus("You must be logged in to upload.");
      return;
    }

    const filePath = `${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message || uploadError);
      setUploadStatus(
        `❌ Upload failed: ${uploadError.message || "Unknown error"}`
      );
      return;
    }

    const record = {
      filename: file.name,
      uploaded_by: user.id,
    };

    const { error: insertError } = await supabase
      .from("files")
      .insert([record]);

    if (insertError) {
      console.error("Insert error:", insertError.message || insertError);
      setUploadStatus("Saving file info failed");
      return;
    }

    setUploadStatus("✅ Upload successful!");
    setFile(null);
  };

  return (
    <Router>
      <nav
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {user ? (
          <>
            <Link to="/">📤 Upload</Link>
            <Link to="/files">📂 View Files</Link>
            <button
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) {
                  alert("Error logging out!");
                  console.error("Logout error:", error);
                } else {
                  window.location.href = "/";
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">🆕 Signup</Link>
            <Link to="/login">🔐 Login</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div style={{ textAlign: "center", paddingTop: "30px" }}>
                <h2>📄 Upload Your PDF</h2>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ margin: "10px" }}
                />
                <button
                  onClick={handleUpload}
                  style={{
                    padding: "10px 20px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Upload
                </button>
                <p
                  style={{
                    color: uploadStatus.startsWith("✅") ? "green" : "red",
                  }}
                >
                  {uploadStatus}
                </p>
              </div>
            ) : (
              <div style={{ paddingTop: "30px", textAlign: "center" }}>
                <h3>Please log in to upload PDFs</h3>
              </div>
            )
          }
        />
        <Route path="/files" element={<FileList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view/:filename" element={<SharedView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
