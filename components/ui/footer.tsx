import A from "@/components/ui/a"

export default function Footer() {
  return (
    <footer className="pt-8 pb-4 flex text-xs text-center dark:text-gray-400 text-gray-500">
      <div className="grow text-center">
        <A target="_blank" href="https://twitter.com/chtslk">
          Cihat Salik
        </A>
        &nbsp;© 2023
      </div>
    </footer>
  )
}