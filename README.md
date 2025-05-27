# 📄 PDF Collaboration App

A secure, user-friendly web app for uploading, viewing, and sharing PDF files — with real-time commenting, authentication, and password reset support.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure sign-up & login via Supabase Auth
  - Password reset via email link

- 📤 **PDF Upload**
  - Only PDF files allowed
  - Drag-and-drop & file picker supported
  - Uploaded files stored in Supabase Storage
  - Prevents re-upload of duplicate filenames

- 📁 **File Management**
  - View all uploaded PDFs
  - Search PDFs by name
  - Delete files uploaded by the logged-in user
  - Public viewable link sharing

- 💬 **Commenting System**
  - Comments stored in Supabase table `comments`
  - Anyone can leave a comment with their name
  - Real-time feedback on new comments

- 🧑‍💼 **Access-Based Navigation**
  - Only show upload/view links when logged in
  - Logout functionality available
  - Intuitive access control flow

- 🎨 **Responsive UI**
  - Clean layout for all screens
  - Error/success messages for key actions

---

## 🛠️ Tech Stack

- **Frontend**: React (Create React App), JSX
- **Backend/Auth/DB**: Supabase
- **Storage**: Supabase Storage buckets

---

## 📦 Project Structure

```bash
pdf-collab-app/
├── public/
├── src/
│   ├── pages/
│   │   ├── FileList.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── SharedView.jsx
│   ├── supabaseClient.js
│   └── App.js
├── README.md
└── package.json
---

## 🌐 Deployment Ready

- GitHub repo: [https://github.com/sshresth52/pdf-collab-app](https://github.com/sshresth52/pdf-collab-app)
- Replace `localhost` with deployed URL for production
- Easy to host on **Vercel** or **Netlify**

---

## 🙋‍♂️ Author

**Sudhanshu Shresth**  
[GitHub Profile](https://github.com/sshresth52)

---

