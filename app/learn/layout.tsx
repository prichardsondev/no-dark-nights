import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn | No Dark Nights",
  description:
    "Set up Codex, then follow eight beginner-friendly steps from downloading the project to printing and reflecting.",
};

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
