import { Box } from "@mui/material";
import ProfessionalTimeline from "./ProfessionalTimeline";

const About = () => {
  return (
    <Box
      height={"100%"}
      mt={10}
      sx={{
        background: "transparent",
      }}
    >
      <ProfessionalTimeline />
    </Box>
  );
};

export default About;
