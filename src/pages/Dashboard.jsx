import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const user = await supabase.auth.getUser();
    if (!user?.data?.user) {
      setMessage("Not logged in");
      return;
    }

    const filePath = `${user.data.user.id}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setMessage("Upload failed");
      return;
    }

    const { error: dbError } = await supabase.from("files").insert([
      {
        filename: file.name,
        uploaded_by: user.data.user.id,
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      setMessage("Upload failed");
      return;
    }

    setMessage("Upload successful!");
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}
