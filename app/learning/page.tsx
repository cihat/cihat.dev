'use client';

import Container from "@/components/ui/container";
import LearningRepo from "@/components/learning/repo";
import LearningContent from "@/components/learning/content";

export default function Learning() {

  return (
    <Container className="min-h-[80vh] left-animation" size="large">
      <LearningRepo />
      <LearningContent />
    </Container>
  )
}