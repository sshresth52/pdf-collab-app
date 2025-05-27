import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    // Wait until Supabase restores the session from URL
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setIsSessionReady(true);
      } else {
        setMessage("❌ Auth session missing. Please use the email link again.");
      }
    };

    checkSession();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Password updated successfully!");
    }
  };

  if (!isSessionReady) {
    return <p>Loading reset session...</p>;
  }

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Password</button>
      <p>{message}</p>
    </div>
  );
}
