"use client";

import { useResumeConfig } from "@/hooks/useResumeConfig";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useState } from "react";

const MAX_URLS = 3;

export default function ResumeAdminPage() {
  const { resumeConfig, isLoading, error, updateResumeConfig, isSaving } =
    useResumeConfig();
  const [newUrl, setNewUrl] = useState("");
  const [inputError, setInputError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const urls = resumeConfig?.urls ?? [];
  const activeIndex = resumeConfig?.activeIndex ?? 0;

  async function handleAdd() {
    if (!newUrl.trim()) {
      setInputError("URL cannot be empty.");
      return;
    }
    try {
      new URL(newUrl.trim());
    } catch {
      setInputError("Please enter a valid URL.");
      return;
    }
    if (urls.length >= MAX_URLS) {
      setInputError(`You can store at most ${MAX_URLS} resume URLs.`);
      return;
    }
    setInputError("");
    const updatedUrls = [newUrl.trim(), ...urls].slice(0, MAX_URLS);
    await updateResumeConfig({ urls: updatedUrls, activeIndex: 0 });
    setNewUrl("");
    setSuccessMsg("URL added and set as active.");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleDelete(index: number) {
    const updatedUrls = urls.filter((_, i) => i !== index);
    let newActive = activeIndex;
    if (index === activeIndex) newActive = 0;
    else if (index < activeIndex) newActive = activeIndex - 1;
    await updateResumeConfig({
      urls: updatedUrls,
      activeIndex: Math.max(0, Math.min(newActive, updatedUrls.length - 1)),
    });
    setSuccessMsg("URL removed.");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleSetActive(index: number) {
    await updateResumeConfig({ urls, activeIndex: index });
    setSuccessMsg("Active resume updated.");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={20}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Resume URL Editor
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Store up to {MAX_URLS} resume URLs. The active one is served at{" "}
          <strong>/resume</strong>.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        {/* Add new URL */}
        <Stack direction="row" spacing={1} mb={3}>
          <TextField
            fullWidth
            size="small"
            label="New resume URL"
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
              setInputError("");
            }}
            error={!!inputError}
            helperText={inputError}
            placeholder="https://..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isSaving || urls.length >= MAX_URLS}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {urls.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No resume URLs saved yet.
          </Typography>
        ) : (
          <List disablePadding>
            {urls.map((url, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  mb: 1,
                  border: index === activeIndex ? "2px solid" : "1px solid",
                  borderColor:
                    index === activeIndex ? "primary.main" : "divider",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  backgroundColor:
                    index === activeIndex ? "action.selected" : "transparent",
                }}
              >
                <Tooltip
                  title={
                    index === activeIndex ? "Active" : "Set as active"
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => handleSetActive(index)}
                    color={index === activeIndex ? "success" : "default"}
                    disabled={isSaving}
                  >
                    {index === activeIndex ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                      }}
                    >
                      {url}
                    </Typography>
                  }
                  secondary={index === activeIndex ? "Active" : `#${index + 1}`}
                />

                <Tooltip title="Open in new tab">
                  <IconButton
                    size="small"
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(index)}
                    disabled={isSaving}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        )}

        {isSaving && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
