import Banner from "@/components/homePageComponents/Banner";
import { Box, Typography } from "@mui/material";
import About from "./about/page";
import Credentials from "./credentials/page";
import Projects from "./projects/page";
import Publications from "./publications/page";

const SectionPanel = ({
  id,
  title,
  addTopClearance = false,
  children,
}: {
  id: string;
  title: string;
  addTopClearance?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    id={id}
    component="section"
    sx={{
      scrollMarginTop: "130px",
      px: { xs: 0, sm: 3, md: 4 },
      pt: addTopClearance ? { xs: 6, md: 8 } : { xs: 3, md: 4 },
      pb: { xs: 3, md: 4 },
    }}
  >
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 0, md: 3 },
          py: 1.5,
        }}
      >
        <Typography
          variant="professional"
          sx={{
            pl: 1,
            letterSpacing: 1.2,
            fontSize: { xs: "0.95rem", md: "1rem" },
            textTransform: "uppercase",
          }}
        >
          <Box component="span" sx={{ mr: 0.75 }}>
            #
          </Box>
          {title}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  </Box>
);

export default function Home() {
  return (
    <Box m={0} p={0} minHeight={"100%"} className="home">
      <SectionPanel id="home" title="Home" addTopClearance>
        <Banner />
      </SectionPanel>

      <SectionPanel id="about" title="About">
        <About />
      </SectionPanel>

      <SectionPanel id="credentials" title="Credentials">
        <Credentials />
      </SectionPanel>

      <SectionPanel id="projects" title="Projects">
        <Projects />
      </SectionPanel>

      <SectionPanel id="publications" title="Publications">
        <Publications />
      </SectionPanel>
    </Box>
  );
}
