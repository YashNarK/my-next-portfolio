"use client";

import { getCroppedImg } from "@/utils/cropImage";
import { uploadImage } from "@/lib/firebase/uploadFiles";
import { useProfileConfig } from "@/hooks/useProfileConfig";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

export default function ProfileAdminPage() {
  const { profileConfig, isLoading, error, updateProfileConfig, isSaving } =
    useProfileConfig();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    // reset state
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setUploadError("");
    setSuccessMsg("");
  }

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const url = await uploadImage(file, "profile/profile-pic");
      await updateProfileConfig({ imageUrl: url });
      setSuccessMsg("Profile picture updated!");
      setImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setIsUploading(false);
    }
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
          Profile Picture
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Upload an image and crop it to fit the circular frame on the home
          page.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        {/* Current profile picture preview */}
        {!imageSrc && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              src={profileConfig?.imageUrl || "/img/myImageCropped.png"}
              sx={{ width: 150, height: 150, mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Current profile picture
            </Typography>
          </Box>
        )}

        {/* File picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
          sx={{ mb: 3 }}
        >
          Choose Image
        </Button>

        {/* Cropper */}
        {imageSrc && (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 320,
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
                background: "#222",
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>

            <Stack spacing={1} mb={3}>
              <Typography variant="body2">Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(_, v) => setZoom(v as number)}
              />
            </Stack>

            <Button
              variant="contained"
              startIcon={
                isUploading || isSaving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSave}
              disabled={isUploading || isSaving}
              fullWidth
            >
              {isUploading || isSaving ? "Saving…" : "Crop & Save"}
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
