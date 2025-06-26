import { Box } from "@mui/material";
import ProfessionalTimeline from "./ProfessionalTimeline";

const About = () => {
  return (
    <Box
      minHeight={"90%"}
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
