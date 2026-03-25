"use client";
import CodeLikeTypography from "@/components/homePageComponents/CodeLikeTypography";
import useExperiences from "@/hooks/useExperiences";
import { useAppSelector } from "@/hooks/useReduxCustom";
import { calculateExperience, localeDate } from "@/utils/dateFunctions";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { IExperience } from "../../../data/data.type";
import "./professionalTimeline.css"; // Ensure you have the correct path to your CSS file

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
  // Auto-split description into bullet points and extract client badge

  // Exception list for not splitting on periods within these tokens
  const exceptions = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".css",
    ".json",
    ".md",
    ".mjs",
    ".cjs",
    ".html",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
  ];

  // Regex to split only on periods that are likely to end a sentence (not part of an exception)
  function smartSplit(text: string): string[] {
    // Replace exceptions with placeholders
    const placeholderMap: { [key: string]: string } = {};
    let tempText = text;
    exceptions.forEach((ext: string, i: number) => {
      const regex = new RegExp(ext.replace(".", "\\."), "gi");
      const placeholder = `__EXT${i}__`;
      placeholderMap[placeholder] = ext;
      tempText = tempText.replace(regex, placeholder);
    });
    // Split on ". " or ".Client:" or ".Client: " or ".\n" or end of string, but not inside a placeholder
    let parts: string[] = tempText
      .split(/\.(?=\s|Client:|$)/g)
      .map((s: any) => (typeof s === 'string' ? s.trim() : s))
      .filter(Boolean);
    // Restore placeholders
    parts = parts.map((part: any) => {
      Object.entries(placeholderMap).forEach(([ph, ext]) => {
        part = part.replace(new RegExp(ph, "g"), ext);
      });
      return part;
    });
    return parts;
  }

  const descParts = smartSplit(experienceItem.description);
  const clientPart = descParts.find((s: any) => typeof s === 'string' && s.startsWith("Client:"));
  const client = clientPart ? clientPart.replace("Client:", "").trim() : null;
  const points = descParts.filter((s: any) => typeof s === 'string' && !s.startsWith("Client:"));

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
        {client && (
          <span style={{ marginLeft: 8 }}>
            <span
              style={{
                display: "inline-block",
                background: "#1976d2",
                color: "#fff",
                borderRadius: 8,
                padding: "2px 8px",
                fontSize: "0.8em",
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            >
              {client}
            </span>
          </span>
        )}
      </Typography>
      <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
        {points.map((point: any, idx: any) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {point}.
          </li>
        ))}
      </ul>
      {experienceItem.type === "education" && experienceItem.cgpa && (
        <p>
          <strong>CGPA:</strong> {experienceItem.cgpa}
        </p>
      )}
    </VerticalTimelineElement>
  );
};;

const ProfessionalTimeline = () => {
  const { data, isLoading } = useExperiences();
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
