import { Image } from 'next/image'

import { ImageResponse } from 'next/server'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'I am currently reading these books'
export const title = 'Reading'

// image href
export const href = '/og/og-book.png'

export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
//  set image url in public folder
export const src = '/og/og-book.png'

 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>Reading</h1>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      // We can also set the image's content type.
    }
  )
}