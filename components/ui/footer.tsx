import A from "@/components/ui/a"

export default function Footer() {
  return (
    <footer className="py-4 flex text-xs text-center dark:text-gray-400 text-gray-500 relative z-40">
      <div className="grow text-center">
        <A target="_blank" href="https://github.com/cihat" title="Visit Cihat Salik's GitHub Profile">
          Cihat Salik
        </A>
        &nbsp;© 2023
      </div>
    </footer>
  )
}
