import SceneBackground from "@/sharedComponents/Scenebackground";
import { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SceneBackground />

      {children}
    </>
  );
}
