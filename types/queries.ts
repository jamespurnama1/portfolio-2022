import type {
  SanityDocument,
  Reference,
  Asset,
  ImageAsset,
  Slug,
} from '@sanity/types'

export interface Post extends SanityDocument {
  _type: 'post'
  title: string
  description: string
  tools: string[] | null
  type: string
  role: string[] | null
  color: Color
  theme: 'light' | 'dark' | null
  aiInvolvement?: string | null
  aiDescription?: string | null
  link: string
  year: number
  slug: Slug
  thumbnailVideo: string | null
  thumbnailImage: string | null
  heroVideo: string | null
  carousel: CarouselItem[] | null
  awards: Award[] | null
  content: Content[] | null
  catIndex?: number
  index?: number
}

export interface CarouselItem {
  _key: string
  alt: string | null
  image: string | null
  video: string | null
}

export interface About extends SanityDocument {
  _type: 'about'
  title: 'About'
  languages: {
    percentage: number
    _type: 'LanguageItem'
    language: string
  }[]
  image: {
    asset: Asset
  }
  resume: {
    asset: Asset
  }
  awards: Award[]
  bio: string
  socials: {_type: 'socialsItem'; media: string; link: URL}[]
  skills: { percentage: number; skill: string; type: string }[]
}

export interface Color {
  hex: string
  alpha: number
  _type: 'color'
  hsv: {
    h: number
    a: number
    s: number
    v: number
    _type: 'hsvaColor'
  }
  rgb: {
    r: number
    a: number
    g: number
    b: number
    _type: 'rgbaColor'
  }
  hsl: {
    h: number
    a: number
    s: number
    l: number
    _type: 'hslaColor'
  }
}

export interface Award {
  index: number
  issuer: string
  icon: { asset: ImageAsset }
  year: string
  gold: string[]
  silver: string[]
  bronze: string[]
  crystal: string[]
}

export interface Content {
  _key: string
  headline: string | null
  body: string | null
  caption: string | null
  attachToTop: boolean | null
  image: string | null
  imageLight: string | null
  video: string | null
}
