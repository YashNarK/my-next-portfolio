// src\app\login\page.tsx
"use client";

import { auth } from "@/lib/firebase/firebase-client";
import { Email } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      // Store token in a cookie
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    // <div style={{ padding: 40 }}>
    //   <input
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     placeholder="Email"
    //   />
    //   <input
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //     placeholder="Password"
    //     type="password"
    //   />
    //   <button onClick={login}>Login</button>
    // </div>
    <Box
      mt={20}
      minHeight="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper elevation={6} sx={{ padding: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
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
