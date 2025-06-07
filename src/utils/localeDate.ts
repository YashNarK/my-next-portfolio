import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default function localeDate(
  dateISO_Value: string,
  formatType: "DD/MM/YYYY" | "MMMM, YYYY" = "DD/MM/YYYY"
) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Convert UTC to local time
  const formatted = dayjs.utc(dateISO_Value).local().format(formatType);
  return formatted;
}
