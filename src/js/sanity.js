import { createClient } from 'https://esm.sh/@sanity/client'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

export const client = createClient({
  projectId: 'glu0cwms',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-05-19',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}