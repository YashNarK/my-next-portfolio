import SceneBackground from "@/sharedComponents/animations/projectLayoutAnimations/Scenebackground";
import { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SceneBackground />

      {children}
    </>
  );
}
