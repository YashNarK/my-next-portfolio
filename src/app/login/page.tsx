"use client";

import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase/firebase-client";
import { encryptPayload } from "@/utils/crypto";
import { signInWithCustomToken } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const login = async () => {
    try {
      setError("");
      setResetMessage("");
      setLoggingIn(true);

      const secret = process.env.NEXT_PUBLIC_ENCRYPT_SECRET;
      if (!secret) throw new Error("Encryption secret not configured.");

      // Encrypt credentials before transmission — password never travels in plain text
      const payload = await encryptPayload({ email, password }, secret);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      if (!res.ok) {
        const data = await res.json();
        setLoggingIn(false);
        setError(data.error === "Invalid credentials"
          ? "Incorrect username or password."
          : "Login failed. Please try again.");
        return;
      }

      // Sign in the Firebase client SDK so Firestore/Storage rules see request.auth
      const { customToken } = await res.json();
      if (customToken) {
        await signInWithCustomToken(auth, customToken);
      }

      window.location.href = "/admin";
    } catch (err: unknown) {
      setLoggingIn(false);
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setResetMessage("");
    const target = email.trim() || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
    if (!target) {
      setError("Enter your email address above, then click Forgot Password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, target);
      setResetMessage(`Password reset email sent to ${target}.`);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("Failed to send reset email.");
      }
    }
  };

  return (
    <Box
      minHeight="calc(100vh - 50px)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={4}
    >
      {/* Logging In backdrop */}
      <Backdrop
        open={loggingIn}
        sx={{
          zIndex: 9999,
          color: "#fff",
          flexDirection: "column",
          gap: 3,
          backdropFilter: "blur(4px)",
        }}
      >
        <CircularProgress color="inherit" size={56} thickness={4} />
        <Typography variant="h6" fontWeight="bold">
          Logging In…
        </Typography>
      </Backdrop>

      <Paper elevation={6} sx={{ padding: 2, width: 350, borderRadius: 3 }}>
        <Typography
          variant="codeLike"
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Admin Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        {error && (
          <Typography color="error" mt={1} variant="body2">
            {error}
          </Typography>
        )}

        {resetMessage && (
          <Typography color="success.main" mt={1} variant="body2">
            {resetMessage}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
          onClick={login}
        >
          Login
        </Button>

        <Button
          fullWidth
          variant="text"
          color="secondary"
          sx={{ mt: 1 }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </Button>
      </Paper>
    </Box>
  );
}
