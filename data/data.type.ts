type myVersionControlTechnologies = "Git" | "GitHub" | "GitLab";
type myLanguages = "JavaScript" | "TypeScript" | "Python" | "Solidity";
type myFrontEndTechnologies =
  | "React"
  | "Redux"
  | "Next.js"
  | "Tailwind CSS"
  | "Chakra UI"
  | "Material UI"
  | "Zustand"
  | "Vite";
type myBackEndTechnologies = "Node.js" | "Express";
type myDatabasetechnologies =
  | "MongoDB"
  | "MySQL"
  | "PostgreSQL"
  | "CosmoDB"
  | "SQL Server";
type myAPItechnologies = "GraphQL" | "REST API" | "Web3 API";
type myBlockchainTechnologies = "Ethereum" | "Polygon" | "Hyperledger Fabric";
type mySkills = "Web Development" | "Blockchain Development";

type myTechnologies =
  | myLanguages
  | myFrontEndTechnologies
  | myBackEndTechnologies
  | myDatabasetechnologies
  | myAPItechnologies
  | myBlockchainTechnologies
  | mySkills
  | myVersionControlTechnologies;

interface IProject {
  title: string;
  description: string;
  technologiesUsed: string[];
  image?: string | File;
  demoLink: string;
  sourceLink: string;
  potrait?: string | File;
  oneLiner: string;
}

interface ICredential {
  title: string;
  description: string;
  image: string | File;
  link: string;
  issuedDate: string;
  issuedBy: string;
  credentialID: string;
}

interface IPublication {
  title: string;
  description: string;
  date: string;
  link: string;
  publisher: string;
  audio?: string | File;
}

interface IExperience {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  companyOrInstitution: string;
  cgpa?: number;
  location: string;
  type: "work" | "education";
  order: number;
}

export type {
  myTechnologies,
  IProject,
  ICredential,
  IPublication,
  IExperience,
};
