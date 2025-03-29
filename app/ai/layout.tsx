// app/ai/layout.tsx
import Link from "next/link";
import Container from "@/components/ui/container";
import { Home } from "lucide-react";

export default async function Layout({ children }) {
  return (
    <Container className="min-h-[75vh]" size="default">
      <div className="flex items-center justify-between py-4 border-b mb-4">
        <h1 className="text-xl font-medium">AI Pages</h1>
        <Link 
          href="/ai" 
          className="flex items-center text-sm px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Home className="h-4 w-4 mr-1.5" />
          <span>Page Index</span>
        </Link>
      </div>
      
      {children}
    </Container>
  );
}
