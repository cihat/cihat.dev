import A from "@/components/ui/a"

export default function Footer() {
  return (
    <footer className="p-6 pt-3 pb-6 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500">
      <div className="grow text-left">
        Cihat Salik (
        <A target="_blank" href="https://twitter.com/chtslk">
          @chtslk
        </A>
        )
      </div>
      <div>
        <A target="_blank" href="https://github.com/cihat/cihat.dev">
          Source
        </A>
      </div>
    </footer>
  )
}