import { IProject } from "./data.type";

const projects: IProject[] = [
  {
    title: "SimpleDEX",
    oneLiner: "A Decentralized Exchange on the Sepolia TestNet.",
    description: `A Simple decentralized exchange (DEX) that allows users to trade cryptocurrencies directly with each other. It allows exchange without the need for a centralized intermediary (like a traditional exchange). DEXs use smart contracts to facilitate trades and manage liquidity pools. The DEX is currently available on Sepolia Testnet only.`,
    technologiesUsed: [
      "React",
      "Redux",
      "Chakra UI",
      "Solidity",
      "Ethereum",
      "Web3 API",
      "Web Development",
      "Git",
    ],
    image: "/img/project/sepolia/simpledex.jpeg",
    potrait: "/img/project/simpledex/SimpleDexPotrait.jpeg",
    demoLink: "https://narendranai.work/SimpleDex/",
    sourceLink: "https://github.com/YashNarK/SimpleDex",
  },
  {
    title: "GameHub",
    oneLiner: "A Game Store like app with multipage routing.",
    description: `
      GameHub is a frontend only, Single Page Application built using React + TypeScript.
      It is a game store like app with multipage routing, pagination, full-responsiveness, 
        dark and light mode, cache management and global state management enabled and developed with the best user experience in mind.
      We utilize rawg.io's backend APIs for getting the dynamic content for our application.`,
    technologiesUsed: [
      "React",
      "Chakra UI",
      "Web Development",
      "Git",
      "Zustand",
      "TypeScript",
      "Vite",
    ],
    image: "/img/project/gamehub/GameHubPotrait.jpeg",
    potrait: "/img/project/gamehub/GameHubPotrait.jpeg",
    demoLink: "https://narendranai.work/game-hub/",
    sourceLink: "https://github.com/YashNarK/game-hub",
  },
  {
    title: "PyModuleGen",
    oneLiner: "A Python module to sructure your project.",
    description: `
    pymodulegen is a project aimed to generate python modules and packages 
    and add root directory of the project in sys path to allow importing parent modules in child using absolute paths relative to root directory.
     Generate module and __init__.py (in case of package) files in the specified directory. 
     Set root directory and add root directory path to sys path so that absolute path imports will work even in child modules.`,
    technologiesUsed: ["Git", "Python"],
    image: "/img/project/pymodulegen/PyModulegenPotrait.jpeg",
    potrait: "/img/project/pymodulegen/PyModulegenPotrait.jpeg",
    demoLink: "https://pypi.org/project/pymodulegen/",
    sourceLink: "https://github.com/YashNarK/pymodulegen",
  },
];

export default projects;
