"use client";

import { auth } from "@/lib/firebase/firebase-client";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 add error state

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      setError(""); // Clear any previous error
      window.location.href = "/admin";
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          setError("Incorrect username or password.");
        } else {
          setError(err.message); // fallback for other Firebase auth errors
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Box
      minHeight="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
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
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
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
      </Paper>
    </Box>
  );
}
