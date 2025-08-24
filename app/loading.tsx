import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="flex flex-col sm:py-6 py-3 h-[calc(100vh-140px)]" as="main">
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </Container>
  );
}
