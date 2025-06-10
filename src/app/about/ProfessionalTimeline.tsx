"use client";
import { Box, Divider, Stack, Typography } from "@mui/material";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { IExperience } from "../../../data/data.type";
import "./professionalTimeline.css"; // Ensure you have the correct path to your CSS file
import { useAppSelector } from "@/hooks/useReduxCustom";
import { useEffect } from "react";
import { calculateExperience, localeDate } from "@/utils/dateFunctions";
import useExperiences from "@/hooks/useExperiences";
import CodeLikeTypography from "@/components/homePageComponents/CodeLikeTypography";

const CustomTimelineElement = ({
  experienceItem,
}: {
  experienceItem: IExperience & { id: string };
}) => {
  const isWork = experienceItem.type === "work";
  const icon = isWork ? <WorkIcon /> : <SchoolIcon />;
  const bgColor = isWork ? "rgb(33, 150, 243)" : "rgb(233, 30, 99)";
  const displayDate = experienceItem.isCurrent
    ? `${localeDate(experienceItem.startDate)} - Present`
    : `${localeDate(experienceItem.startDate)} - ${
        experienceItem.endDate && localeDate(experienceItem.endDate)
      }`;
  return (
    <VerticalTimelineElement
      key={experienceItem.id}
      className={`vertical-timeline-element--${experienceItem.type}`}
      contentStyle={{ background: "transparent" }}
      contentArrowStyle={{ borderRight: `7px solid ${bgColor}` }}
      date={displayDate}
      iconStyle={{ background: bgColor, color: "#fff" }}
      icon={icon}
    >
      <Typography
        variant="codeLike"
        className="vertical-timeline-element-title"
      >
        {experienceItem.title}
      </Typography>
      <Typography
        variant="professional"
        sx={{ display: "block" }}
        className="vertical-timeline-element-subtitle"
      >
        {experienceItem.companyOrInstitution}, {experienceItem.location}
      </Typography>
      <p>{experienceItem.description}</p>
      {experienceItem.type === "education" && experienceItem.cgpa && (
        <p>
          <strong>CGPA:</strong> {experienceItem.cgpa}
        </p>
      )}
    </VerticalTimelineElement>
  );
};

const ProfessionalTimeline = () => {
  const { data, isLoading, error } = useExperiences();
  const mode = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--timeline-line-color",
      mode === "dark" ? "white" : "black"
    );
  }, [mode]);
  const experiencesWithOrder = (data || [])
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .map((item, index) => ({
      ...item,
      order: index + 1, // oldest gets 1, newest gets highest
    }));
  return (
    <Box>
      <CodeLikeTypography textAlignment={"center"}>
        {`${calculateExperience("2020-10-28")} of Professional journey ${
          Boolean(isLoading) ? "is now Loading...." : ""
        }`}
      </CodeLikeTypography>
      <VerticalTimeline>
        {experiencesWithOrder
          .sort((item, nextItem) => {
            return nextItem.order - item.order;
          })
          .map((item) => {
            return (
              <CustomTimelineElement key={item.id} experienceItem={item} />
            );
          })}
        <VerticalTimelineElement
          iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
          icon={<StarIcon />}
        />
      </VerticalTimeline>
    </Box>
  );
};

export default ProfessionalTimeline;
