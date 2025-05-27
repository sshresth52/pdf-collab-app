import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function SharedView() {
  const { filename } = useParams();
  const [comments, setComments] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [commentText, setCommentText] = useState("");

  const publicUrl = supabase.storage.from("pdfs").getPublicUrl(filename)
    .data.publicUrl;

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("filename", filename)
        .order("created_at", { ascending: true });

      if (!error) setComments(data);
      else console.error("Error fetching comments:", error);
    };

    fetchComments();
  }, [filename]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("comments").insert([
      {
        filename,
        guest_name: guestName,
        content: commentText,
      },
    ]);

    if (!error) {
      setGuestName("");
      setCommentText("");

      // Refetch comments
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("filename", filename)
        .order("created_at", { ascending: true });

      setComments(data);
    } else {
      console.error("Insert comment error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{filename}</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <iframe
          src={publicUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
          style={{ border: "none" }}
        ></iframe>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3>💬 Leave a Comment</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            required
            rows={4}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Post Comment
          </button>
        </form>
      </div>

      <div>
        <h3>🗨️ Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
            >
              <strong>{c.guest_name || "Anonymous"}</strong>
              <p>{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
