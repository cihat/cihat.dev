import unsplash from "@/lib/unsplash";
import PersonaleInfo from "@/components/personel-info"
import { IRandomPhoto } from "@/types/random-photo"

export default async function Home() {
  const photo = await unsplash.getRandomPhoto() as IRandomPhoto

  return (
    <>
      <PersonaleInfo randomPhoto={photo} />
    </>
  )
}

