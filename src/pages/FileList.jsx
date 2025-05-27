import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setUserId(user.id);

      const { data, error } = await supabase
        .from("files")
        .select("filename, uploaded_by")
        .order("uploaded_at", { ascending: false });

      if (!error) setFiles(data);
    };

    fetchFiles();
  }, []);

  const getPublicUrl = (filename) =>
    supabase.storage.from("pdfs").getPublicUrl(filename).data.publicUrl;

  const handleDelete = async (filename) => {
    const { error: storageError } = await supabase.storage
      .from("pdfs")
      .remove([filename]);

    const { error: dbError } = await supabase
      .from("files")
      .delete()
      .eq("filename", filename);

    if (!storageError && !dbError) {
      setFiles(files.filter((f) => f.filename !== filename));
    } else {
      console.error("Delete failed:", storageError || dbError);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>📁 Your Uploaded Files</h2>

      <input
        type="text"
        placeholder="🔍 Search by filename"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "25px",
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {filteredFiles.length === 0 ? (
        <p>No files found.</p>
      ) : (
        filteredFiles.map((file) => (
          <div
            key={file.filename}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "30px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h4>{file.filename}</h4>
            <p>
              <em>Uploader ID:</em> {file.uploaded_by}
            </p>

            <iframe
              src={getPublicUrl(file.filename)}
              width="100%"
              height="400px"
              title={`preview-${file.filename}`}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            ></iframe>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/view/${file.filename}`;
                  navigator.clipboard.writeText(link);
                  alert("🔗 Link copied to clipboard!");
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Copy Share Link
              </button>

              {file.uploaded_by === userId && (
                <button
                  onClick={() => handleDelete(file.filename)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
