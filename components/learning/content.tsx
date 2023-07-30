import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { H1 } from "app/(post)/components/h1"
import CurrentTopics from "./current-topics.mdx";
import NextTopics from "./next-topics.mdx";
import { MDXProvider } from "@mdx-js/react";

export default function LearningContent() {


  return (
    <Tabs defaultValue="current-topics" className="w-full flex flex-col justify-center items-center mt-4">
      <TabsList>
        <TabsTrigger value="current-topics">Current Topics</TabsTrigger>
        <TabsTrigger value="next-topics">Next Topics</TabsTrigger>
      </TabsList>
      <TabsContent value="current-topics" className="w-full flex flex-col">
        <CurrentTopics />
      </TabsContent>
      <TabsContent value="next-topics" className="w-full flex flex-col">
        <NextTopics />
      </TabsContent>
    </Tabs>
  )
}