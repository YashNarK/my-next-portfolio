import { resumeOnedriveURL } from "@/lib/onedrive/resume";
import { redirect } from "next/navigation";

export default function ResumeRedirectPage() {
  redirect(resumeOnedriveURL);
}

