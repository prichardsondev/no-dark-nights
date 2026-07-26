import type { Metadata } from "next";
import { LithophaneStudio } from "../LithophaneStudio";

export const metadata: Metadata = {
  title: "Night-light Studio | No Dark Nights",
  description:
    "Turn an image into a curved, print-ready lithophane STL locally in your browser.",
};

export default function StudioPage() {
  return <LithophaneStudio />;
}
