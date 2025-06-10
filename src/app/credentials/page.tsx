"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useCredentials from "@/hooks/useCredentials";
import { localeDate } from "@/utils/dateFunctions";

const Credentials = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(0);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { data: certificates, isLoading, error } = useCredentials();

  const LoadingSkeleton = () => {
    return (
      <>
        <Box
          mt={20}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          minHeight={"100%"}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                width: { xs: "90%", md: "40%" },
                height: { xs: "100px", md: "400px" },
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                width: { xs: "90%", md: "40%" },
                height: { xs: "100px", md: "400px" },
              }}
            />
          </Stack>
          <Typography
            variant="professional"
            align="center"
            sx={{
              fontSize: "1.8rem",
            }}
          >
            Loading Credentials...
          </Typography>
        </Box>
      </>
    );
  };
  return (
    <Box height={"100%"}>
      {isLoading ? (
        <LoadingSkeleton />
      ) : certificates && certificates.length > 0 ? (
        <Stack
          p={2}
          mt={10}
          height={"100%"}
          justifyContent="center"
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          divider={
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Divider orientation="vertical" flexItem />
            </Box>
          }
        >
          <Box width={{ xs: "100%", md: "50%" }} boxSizing="border-box">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={(swiper) =>
                setSelectedCertificate(swiper.activeIndex)
              }
              style={{
                width: "100%",
                paddingLeft: isMdUp ? "150px" : "0px",
                paddingRight: isMdUp ? "150px" : "0px",
              }}
            >
              {certificates.map((cert) => (
                <SwiperSlide key={cert.id}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    boxShadow={4}
                    p={2}
                    borderRadius={2}
                    mb={4}
                    sx={{ background: "transparent" }}
                  >
                    {typeof cert.image === "string" && (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        style={{
                          width: "100%",
                          height: "300px",
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "10px",
                          marginBottom: "1rem",
                        }}
                      />
                    )}
                    <Typography
                      variant="codeLike"
                      sx={{
                        fontSize: "1.2rem",
                        textAlign: "center",
                      }}
                    >
                      {cert.title}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            className="description-box"
            border={"2px solid gray"}
            width={{ xs: "100%", md: "50%" }}
            p={3}
          >
            <Typography
              variant="professional"
              sx={{
                fontSize: { xs: "0.95rem", md: "1rem" },
                textAlign: "justify",
              }}
            >
              {certificates[selectedCertificate].description}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                justifyContent: {
                  xs: "flex-start",
                  sm: "space-between",
                },
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
              }}
              spacing={2}
              mt={3}
            >
              <Box>
                <Typography
                  variant="professional"
                  sx={{ fontSize: "0.9rem", display: "block", my: 3 }}
                >
                  Credential ID:
                </Typography>
                <Typography
                  variant="professional"
                  sx={{ fontSize: "0.9rem", display: "block", my: 3 }}
                >
                  {certificates[selectedCertificate].credentialID}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                LinkComponent={"a"}
                href={certificates[selectedCertificate].link}
                target="_blank"
                sx={{
                  height: "fit-content",
                }}
              >
                View Credential
              </Button>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              mt={3}
            >
              <Typography variant="professional" sx={{ fontSize: "0.9rem" }}>
                Issued by: {certificates[selectedCertificate].issuedBy}
              </Typography>
              <Typography variant="professional" sx={{ fontSize: "0.9rem" }}>
                Issued at:{" "}
                {localeDate(
                  certificates[selectedCertificate].issuedDate,
                  "MMMM, YYYY"
                )}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Box
          mt={20}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Typography variant="h4" align="center" mt={10}>
            No Credentials Available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Credentials;
