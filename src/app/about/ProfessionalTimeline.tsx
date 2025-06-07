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
const data: (IExperience & { id: number })[] = [
  {
    id: 1,
    type: "work",
    title: "Senior Software Engineer",
    description: `Led development of an anomaly monitoring using React JS, Express.js, and AWS. Developed a demand forecast tool and ticketing portal using Angular, enhancing issue resolution workflows and user experience. Engaged in direct client interactions and requirement gathering, translating business needs into technical solutions.`,
    startDate: "28/10/2020",
    endDate: "11/06/2024",
    isCurrent: false,
    companyOrInstitution: "LTIMindtree",
    location: "Chennai",
    order: 2,
  },
  {
    id: 2,
    type: "work",
    title: "Packaged App Development Senior Analyst",
    description: `Built and optimized ReactJS front-end components and pages for improved performance and user experience. Developed and integrated GraphQL and REST APIs for a leading global tech company. Worked in an Agile environment, consistently delivering high-quality features within deadlines. Collaborated with cross-functional teams to ensure seamless deployments and minimal defects.`,
    startDate: "19/06/2024",
    endDate: "",
    isCurrent: true,
    companyOrInstitution: "Accenture",
    location: "Chennai",
    order: 3,
  },
  {
    id: 3,
    type: "education",
    title: "B.E. in Electrical and Electronics Engineering",
    description: `Although I am originally from an Electrical and Electronics Engineering background, I have successfully transitioned into the field of software development. My academic foundation has equipped me with strong analytical and problem-solving skills, which I have effectively applied in my software engineering career.`,
    startDate: "11/07/2016",
    endDate: "30/04/2020",
    cgpa: 8.9,
    isCurrent: false,
    companyOrInstitution: "Coimbatore Institute of Technology",
    location: "Coimbatore",
    order: 1,
  },
];

const CustomTimelineElement = ({
  experienceItem,
}: {
  experienceItem: IExperience & { id: number };
}) => {
  const isWork = experienceItem.type === "work";
  const icon = isWork ? <WorkIcon /> : <SchoolIcon />;
  const bgColor = isWork ? "rgb(33, 150, 243)" : "rgb(233, 30, 99)";
  const displayDate = experienceItem.isCurrent
    ? `${experienceItem.startDate} - Present`
    : `${experienceItem.startDate} - ${experienceItem.endDate}`;
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
  const mode = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--timeline-line-color",
      mode === "dark" ? "white" : "black"
    );
  }, [mode]);
  return (
    <VerticalTimeline>
      {data
        .sort((item, nextItem) => {
          return nextItem.order - item.order;
        })
        .map((item) => {
          return <CustomTimelineElement key={item.id} experienceItem={item} />;
        })}
      <VerticalTimelineElement
        iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
        icon={<StarIcon />}
      />
    </VerticalTimeline>
  );
};

export default ProfessionalTimeline;
