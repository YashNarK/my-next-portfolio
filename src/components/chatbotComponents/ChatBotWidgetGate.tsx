"use client";

import { isVisitorRoute } from "@/sharedComponents/routeVisibility";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Renders the chatbot only on visitor routes.
 *
 * The widget answers questions about the portfolio for people browsing
 * it. The admin is the person who wrote it, so on /admin it is a
 * floating button that covers form controls and buys nothing.
 *
 * Dynamically imported: the widget pulls in the chat window, its hook
 * and the site data those need, none of which the admin panel uses.
 * No fallback — unlike the background, nothing else depends on it being
 * on the page.
 */
const ChatBotWidget = dynamic(() => import("./ChatBotWidget"), { ssr: false });

export default function ChatBotWidgetGate() {
  const pathname = usePathname();

  if (!isVisitorRoute(pathname)) return null;

  return <ChatBotWidget />;
}
