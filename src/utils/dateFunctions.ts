import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export function localeDate(
  dateISO_Value: string,
  formatType: "DD/MM/YYYY" | "MMMM, YYYY" = "DD/MM/YYYY"
) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Convert UTC to local time
  const formatted = dayjs.utc(dateISO_Value).local().format(formatType);
  return formatted;
}
export function calculateExperience(startDateStr: string): string {
  const startDate = new Date(startDateStr);
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} year${years !== 1 ? "s" : ""} and ${months} month${
    months !== 1 ? "s" : ""
  }`;
}
