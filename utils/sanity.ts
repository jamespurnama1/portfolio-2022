import type { Post, About } from '~/types/queries'

const queries = {
  landing: groq`{
  "post":  *[_type == "post"] | order(index asc) {
  _id,
  _rev,
  _type,
  title,
  description,
  type,
  role,
  color,
  theme,
  aiInvolvement,
  aiDescription,
  "thumbnailVideo": thumbnail.asset->url,
  "thumbnailImage": thumbnailImage.asset->url,
  "heroVideo": heroMedia.asset->url,
  "carousel": carousel[defined(image.asset->url)] {
    _key,
    alt,
    "url": image.asset->url
  },
  "content": content[] {
    _key,
    headline,
    body,
    caption,
    attachToTop,
    "image": image.asset->url,
    "imageLight": imageLight.asset->url,
    "video": video.asset->url
  },
  link,
  slug,
  year,
  tools,
  awards[] {
    "icon": {
      "asset": icon.asset->{
        _id,
        url,
        originalFilename,
        size
      }
    },
    gold,
    silver,
    bronze,
    crystal,
    issuer,
    index
  },
  _createdAt,
  _updatedAt
}
}`,
  about: groq`
{
"about" : *[_type == "about"]{
  _type,
  _id,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  "image": {
    "asset": image.asset->{
      _id,
      url,
      originalFilename,
      size
    }
  },
  awards[] {
    "icon": {
      "asset": icon.asset->{
        _id,
        url,
        originalFilename,
        size
      }
    },
    gold,
    silver,
    bronze,
    crystal,
    issuer,
    index
  },
  socials,
  bio,
  languages,
  skills,
  "resume": {
    "asset": resume.asset->{
      _id,
      url,
      originalFilename,
      size
    }
  }
} | order(_createdAt asc)[0]
}`,
}

export async function fetchSanity<T extends 'landing' | 'about'>(
  type: T,
): Promise<T extends 'landing' ? { post: Post[] } : { about: About }> {
  const sanity = useSanity()
  return await sanity.fetch<
    T extends 'landing' ? { post: Post[] } : { about: About }
  >(queries[type])
}
