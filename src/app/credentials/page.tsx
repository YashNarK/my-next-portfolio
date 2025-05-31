"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
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

// Mock certificate list
const certificates = [
  {
    id: 1,
    title: "Microsoft Certified: Azure Fundamentals",
    image: "/img/certs/az900.png",
    link: "https://www.credly.com/badges/8f3d8bd0-496b-45ec-9aaa-d70dba9512fc/public_url",
    credentialID: "I640-0337",
    issuedBy: "Microsoft",
    issuedDate: "29/08/1998",
    description:
      "This certification provided me with a foundational understanding of cloud computing concepts, focusing on Microsoft's Azure platform. I delved into core Azure services, exploring aspects like security, privacy, compliance, and trust. The course also covered Azure's pricing structures and support options, equipping me with the knowledge to make informed decisions about cloud services.",
  },
  {
    id: 2,
    title: "Professional Certificate Program in Blockchain",
    image: "/img/certs/blockchain.PNG",
    link: "https://success.simplilearn.com/f656c7e3-ee14-4b1a-9909-33a228531870",
    credentialID: "51190127",
    issuedBy: "Simplilearn & IIT Kanpur",
    issuedDate: "29/08/1998",
    description:
      "Through this program, I gained a comprehensive understanding of blockchain technology. Starting with the fundamentals, I progressed to more complex topics, including smart contracts and decentralized applications. The hands-on projects allowed me to build practical skills, such as creating bitcoin wallets and deploying smart contracts. Collaborating with IIT Kanpur's esteemed faculty enriched my learning experience, providing insights into real-world blockchain applications.",
  },
  {
    id: 3,
    title: " ChatGPT Playground for Beginners: Intro to NLP AI",
    image: "/img/certs/chatgpt.jpg",
    link: "https://www.coursera.org/account/accomplishments/certificate/M5EA8Q9U8H5P",
    credentialID: "M5EA8Q9U8H5P",
    issuedBy: "Coursera",
    issuedDate: "29/08/1998",
    description:
      "This course introduced me to the basics of natural language processing and the functionalities of ChatGPT. I learned how to manipulate various parameters like 'temperature' and 'max tokens' to influence AI-generated responses. The practical exercises helped me understand the importance of prompt engineering and how to guide AI behavior effectively, laying a solid foundation for further exploration in AI and NLP",
  },
  {
    id: 4,
    title: "The Complete 2024 Web Development Bootcamp",
    image: "/img/certs/webdev.jpg",
    link: "https://www.udemy.com/certificate/UC-5d0766cc-d601-4266-b5df-5d815f63ddbb/",
    credentialID: "UC-5d0766cc-d601-4266-b5df-5d815f63ddbb",
    issuedBy: "Udemy",
    issuedDate: "29/08/1998",
    description:
      "Embarking on this bootcamp, I acquired a full-stack web development skill set. The curriculum covered HTML, CSS, JavaScript, and advanced topics like React and Node.js. I built numerous projects, enhancing my portfolio and solidifying my understanding of both front-end and back-end development. The course's practical approach ensured I could apply these skills in real-world scenarios, preparing me for a career in web development.",
  },
  {
    id: 5,
    title: " React JS (Basic to Advanced)",
    image: "/img/certs/react.jpg",
    link: "https://www.geeksforgeeks.org/certificate/002267837151404e887c3dab61ff12c1",
    credentialID: "002267837151404e887c3dab61ff12c1",
    issuedBy: "GeeksforGeeks",
    issuedDate: "29/08/1998",
    description:
      "This course offered a structured journey through React.js, starting from the basics and advancing to complex concepts. I learned about component-based architecture, state management, and the React lifecycle. The hands-on projects and examples provided clarity on building dynamic user interfaces, enhancing my ability to develop scalable and maintainable web applications using React.",
  },
];

const Credentials = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(0);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  return (
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
          onSlideChange={(swiper) => setSelectedCertificate(swiper.activeIndex)}
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
          sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, textAlign: "justify" }}
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
            Issued at: {certificates[selectedCertificate].issuedDate}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Credentials;
