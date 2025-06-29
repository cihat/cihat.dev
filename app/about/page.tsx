import ProfileSection from "@/components/profile-section";
import { Metadata } from "next";
import { META_DATA } from "@/lib/meta";

export const metadata: Metadata = {
  title: "About - Cihat Salik | Software Developer",
  description: "Learn about Cihat Salik, a passionate software developer from Istanbul, Turkey. Discover my journey in programming, open-source contributions, and philosophy. Currently building innovative solutions with JavaScript, React, and modern web technologies.",
  openGraph: {
    title: "About Cihat Salik - Software Developer & Tech Enthusiast",
    description: "Get to know Cihat Salik, a curious software engineer who loves research, learning, and development. Based in Istanbul, contributing to open source and sharing knowledge through blogging.",
    url: `${META_DATA.url}/about`,
    images: [
      {
        url: `${META_DATA.url}/og/me.jpeg`,
        width: 1200,
        height: 630,
        alt: "Cihat Salik - Software Developer",
      }
    ],
  },
  alternates: {
    canonical: `${META_DATA.url}/about`,
  },
};

export default function PersonalInfo() { 
  return <ProfileSection /> 
}
