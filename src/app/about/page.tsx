import { Box } from "@mui/material";
import ProfessionalTimeline from "./ProfessionalTimeline";
import CodeLikeTypography from "@/components/homePageComponents/CodeLikeTypography";
import { calculateExperience } from "@/utils/dateFunctions";

const About = () => {
  return (
    <Box
      minHeight={"100%"}
      mt={10}
      sx={{
        background: "transparent",
      }}
    >
      {" "}
      <CodeLikeTypography textAlignment={"center"}>
        {calculateExperience("2020-10-28")} of Professional journey
      </CodeLikeTypography>
      <ProfessionalTimeline />
    </Box>
  );
};

export default About;
