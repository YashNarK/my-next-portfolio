import Banner from "@/components/homePageComponents/Banner";
import { Box } from "@mui/material";
export default function Home() {
  return (
    <Box m={0} p={0} minHeight={"100%"} className="home">
      <Banner />
    </Box>
  );
}
