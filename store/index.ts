import type { Post } from '~/types/queries'

export const useStore = defineStore('main', {
  state: () => ({
    windowWidth: 0 as number,
    opened: false as boolean,
    loadHome: 0 as number,
    loadWorks: 100 as number, // disabled
    loadWebGL: 0 as number,
    loaded: false as boolean,
    dark: true as boolean,
    posts: [{}] as Post[],
    slugs: [] as string[],
  }),
  actions: {
    async fetch() {
      try {
        // Posts without any thumbnail can't be shown as a card, so they are
        // left out to keep cards, nav, and slugs index-aligned.
        this.posts = ((await fetchSanity('landing')).post as Post[]).filter(
          (post) => post.thumbnailVideo || post.thumbnailImage
        )
        for (let i = 0; i < this.posts.length; i++) {
          this.slugs.push(this.posts[i].slug.current)
        }
        this.loadHome += 10
      } catch (e) {
        console.error(e)
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
        })
      }
    },
  },
})
