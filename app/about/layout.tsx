import NavigationAbout from "@/components/sub-header"
import Container from "@/components/ui/container"

export default async function Layout({ children }) {
  return (
    <Container className="min-h-[75vh]" size="large">
      {/* <div className="mb-16">
        <NavigationAbout />
      </div> */}
      {children}
    </Container>
  )
}

