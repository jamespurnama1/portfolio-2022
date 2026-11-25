<template>
  <div id="container2" class="opacity-0 overflow-x-hidden">
    <div ref="no01"
      class="no01 mix-blend-difference fixed w-safe-height overflow-hidden -bottom-10 -rotate-90 origin-top-left z-10 text-2xl pointer-events-none left-2 md:left-[initial]">
      <div class="text-white relative -left-64 h-10">
        <span v-for="(number, i) in noBoxes" ref="box" :key="i"
          class="box absolute block h-10 font-bold text-3xl text-center text-nowrap leading-10">
          {{ posts[index].title.toLowerCase() }}
        </span>
      </div>
    </div>
    <div
      class="no02 mix-blend-difference fixed w-safe-height overflow-hidden -bottom-10 -rotate-90 origin-top-left z-10 text-2xl pointer-events-none left-2 md:left-6 invisible md:visible">
      <div class="text-white relative -left-64 h-10">
        <span v-for="(number, i) in noBoxes" ref="no02" :key="i"
          class="box absolute block h-10 font-bold text-3xl text-center text-nowrap leading-10">
          {{ posts[index].title.toLowerCase() }}
        </span>
      </div>
    </div>
    <NuxtLink to="/">
      <button
        class="absolute right-0 top-0 md:top-4 md:right-4 z-30 mix-blend-difference flex items-center justify-center border-solid border rounded-2xl bg-transparent transition-all duration-500 ease-in-out pointer-events-auto cursor-pointer border-white text-white hover:text-white hover:bg-white pt-2 pb-[0.15rem] px-4 m-5"
        v-posthog-capture="'go back'" aria-label="Back">
        <p>← Back</p>
      </button>
    </NuxtLink>
    <div ref="content" class="ml-12 w-[calc(100vw-2.5em)]">
      <client-only>
        <template v-if="post">
          <div class="top">
            <video v-if="heroVideo" muted autoplay loop playsinline preload="auto" class="hero" :src="heroVideo" />
            <img v-else-if="post.thumbnailImage" class="hero" :src="post.thumbnailImage" :alt="post.title" />
            <div class="info">
              <p v-if="post.description" class="desc">
                {{ post.description }}
              </p>
              <div class="details">
                <div class="grid">
                  <div>
                    <h4>tools used</h4>
                    <p>
                      {{ (post.tools || []).join(',') }}
                    </p>
                  </div>
                  <div>
                    <h4>role</h4>
                    <p>
                      {{ (post.role || []).join(',') }}
                    </p>
                  </div>
                  <div>
                    <h4>type</h4>
                    <p>
                      {{ post.type }}
                    </p>
                  </div>
                  <div>
                    <h4>year</h4>
                    <p>
                      {{ post.year }}
                    </p>
                  </div>
                </div>
                <NuxtLink v-if="post.link" external :to="post.link">
                  <button class="external" :aria-label="`visit ${post.title}`">
                    <h4>
                      visit website
                      <font-awesome class="icon" icon="arrow-up-right-from-square" />
                    </h4>
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="pin">
            <div v-if="post.carousel?.length" ref="horizontal" class="horizontal">
              <div ref="carousel" class="slide">
                <span v-for="item in post.carousel" :key="item._key">
                  <img :src="item.url" :alt="item.alt || post.title" />
                </span>
              </div>
            </div>
            <template v-for="item in sections" :key="item._key">
              <div class="pinned" :class="{ attached: item.attachToTop }">
                <h3 v-if="item.headline">{{ item.headline }}</h3>
                <p v-if="item.body">{{ item.body }}</p>
                <video v-if="item.video" muted autoplay loop playsinline preload="auto" :src="item.video" />
                <img v-else-if="sectionImage(item)" :src="sectionImage(item)!" :alt="item.caption || item.headline || post.title">
              </div>
            </template>
            <div class="spacer">
              <h4 @click="next">
                <font-awesome class="icon arrowDown" icon="arrow-down" />
                next project: {{ nextWorkTitle.toLowerCase() }}
              </h4>
            </div>
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '~/store'
import type { Content, Post } from '~/types/queries'

const width = ref(window.innerWidth)
const noBoxes = 25
const route = useRoute()
const router = useRouter()
const store = useStore()
const { posts } = storeToRefs(store)
const routePath = computed(() => route.path)

const waitUntil = (condition) => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (!condition()) return
      clearInterval(interval)
      resolve()
    }, 100)
  })
}

/**
 * Get Data
 */
const data = reactive({ title: '' })
const post = ref<Post | null>(null)
const heroVideo = computed(
  () => post.value?.heroVideo || post.value?.thumbnailVideo || null
)
const themeColor = computed(() => post.value?.color?.hex || '#000000')
useSeoMeta({
  title: () =>
    post.value ? `${post.value.title} | James Henry Portfolio` : 'James Henry Portfolio',
  themeColor: () => [
    { content: themeColor.value, media: '(prefers-color-scheme: light)' },
    { content: themeColor.value, media: '(prefers-color-scheme: dark)' },
  ],
  description: () => post.value?.description,
  ogUrl: () => `https://jameshenry.site/${post.value?.slug.current ?? ''}`,
  ogTitle: () =>
    post.value ? `${post.value.title} | James Henry Portfolio` : 'James Henry Portfolio',
  ogDescription: () => post.value?.description,
  ogImage: () => post.value?.thumbnailImage,
  twitterCard: 'summary_large_image',
  twitterCreator: '@jamespurnama1',
  twitterSite: '@jamespurnama1',
})
// Skip sections that have nothing to show (e.g. a deleted asset)
const sections = computed(() =>
  (post.value?.content || []).filter(
    (item) => item.image || item.imageLight || item.video || item.headline || item.body
  )
)
// Light-theme artwork is used when the site is in light mode
function sectionImage(item: Content) {
  return (!store.dark && item.imageLight) || item.image || item.imageLight
}
const load = ref(0)
const index = ref(1)

const nextWork = ref('')
const nextWorkTitle = ref('')
const counter = ref(0);
const len = ref(0);

// Resolves once every image/video in the page has loaded (or failed), so one
// broken asset can't keep the page hidden.
async function waitForMedia() {
  await waitUntil(() => document.querySelector('#container2 .top'))
  await nextTick()
  const els = Array.from(
    document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
      '#container2 img, #container2 video'
    )
  )
  let counter = 0
  await new Promise<void>((resolve) => {
    const done = () => {
      counter++
      load.value = 100 * (counter / els.length)
      store.$patch({ loadWorks: load.value })
      if (counter === els.length) resolve()
    }
    if (!els.length) return resolve()
    els.forEach((el) => {
      const isImg = el instanceof HTMLImageElement
      if (isImg ? el.complete : el.readyState >= 2) return done()
      el.addEventListener(isImg ? 'load' : 'loadeddata', done, { once: true })
      el.addEventListener('error', done, { once: true })
    })
  })
}

async function pushTo() {
  await waitUntil(() => store.posts.length > 1)
  const getID = store.posts.find(
    (obj) => obj.slug.current === routePath.value.substring(1)
  )
  if (!getID) {
    showError({ statusCode: 404 })
    navigateTo({ path: '/404' })
    return
  }
  post.value = getID
  data.title = getID.title
  index.value = store.posts.indexOf(getID)
  // skip the reel (index 0) when cycling through projects
  const next = store.posts[index.value + 1] || store.posts[1]
  nextWork.value = next.slug.current
  nextWorkTitle.value = next.title

  await waitForMedia()
  await waitUntil(() => store.loaded)
  await wait(1000)
  init()
  load.value = 100
  store.$patch({ loadWorks: load.value })
}

async function incrementCounter(_event) {
  counter.value++

  if (counter.value === (len.value - 2)) {
    load.value = 100
    store.$patch({
      loadWorks: load.value,
    })
    await waitUntil(() => store.loaded)
    await wait(1000)
    counter.value = 0;
    init()
  } else {
    load.value = 100 * (counter.value / len.value)
    store.$patch({
      loadWorks: load.value,
    })
  }
}

/**
 * Infinite Marquee
 */
const no01 = ref(null)
const no02 = ref(null)
const boxWidth = computed(() =>
  box.value && box.value.length ? box.value[0].getBoundingClientRect().height + 20 : 0
)
const totalWidth = computed(() => boxWidth.value * noBoxes)
const dirFromLeft = computed(() => '+=' + totalWidth.value)
const dirFromRight = computed(() => '-=' + totalWidth.value)
const from = computed(() => [dirFromLeft.value, dirFromRight.value])
const dur = [60, 60]
const box = ref(null as HTMLSpanElement[] | null)
const mm = gsap.matchMedia()
let tl = null as GSAPTimeline | null;

function mod(int, max) {
  return gsap.utils.wrap(0, max, int)
}

function marquee(which, time, direction, scale, max) {
  gsap.set(which, {
    x(i) {
      return i * boxWidth.value
    },
  })
  const action = gsap
    .timeline({
      overwrite: true,
    })
    .to(which, {
      x: direction,
      modifiers: {
        x: (x) => mod(parseFloat(x), max) + 'px',
      },
      duration: time,
      ease: 'none',
      repeat: -1,
    })
    .timeScale(scale)

  return action
}

const wait = (timeToDelay: number) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay))

/**
 * Carousel
 */

const carousel = ref(null as HTMLDivElement | null)
const carouselWidth = () => carousel.value ? carousel.value.offsetWidth : 0
const horizontal = ref(null as HTMLDivElement | null)
const content = ref(null as HTMLDivElement | null)
const horizontalWidth = computed(() => horizontal.value ? parseFloat(window.getComputedStyle(horizontal.value).width) - parseFloat(window.getComputedStyle(horizontal.value).paddingLeft) - parseFloat(window.getComputedStyle(horizontal.value).paddingRight) : 0)
const carouselVid = ref(null as NodeListOf<HTMLVideoElement> | null)

function init() {

  if (import.meta.client) {
    /**
     * Marquee
     */

    if (no01.value && boxWidth.value) {
      const marquee01 = gsap
        .timeline()
        .add(marquee(box.value, dur[0], from.value[0], 1, totalWidth.value))
      marquee01.play()
    }

    gsap.to('#container2', {
      opacity: 1,
      duration: 1,
    })


    mm.add("(min-width: 768px)", () => {
      const marquee02 = gsap
        .timeline()
        .add(
          marquee(no02.value, dur[1], from.value[1], 1, totalWidth.value),
          0
        )
      marquee02.play()
    })

    /**
     * Carousel
     */
    if (carousel.value && horizontal.value) {
      const tl = gsap
        .timeline({ paused: true })
        .to(carousel.value, {
          x: () => -carouselWidth() + horizontalWidth.value,
          ease: 'power1.inOut',
        })
        .to(
          '.background',
          {
            opacity: 0.2,
          },
          '<'
        )

      ScrollTrigger.create({
        scroller: '#__nuxt',
        trigger: '.horizontal',
        start: 'top 20%',
        end: () => `+=${carouselWidth() - 5}`,
        scrub: 1,
        // markers: true,
        pin: '.content',
        pinType: 'fixed',
        pinSpacing: false,
        invalidateOnRefresh: true,
        animation: tl,
      })
    }
    // gsap.timeline({ paused: true }).to('.arrowUp', {
    //   rotate: '180deg',
    //   scrollTrigger: {
    //     snap: {
    //       snapTo: 0,
    //       duration: { min: 0.5, max: 1 },
    //       delay: 0.5,
    //     },
    //     scrub: 1,
    //     scroller: '#__nuxt',
    //     trigger: '.spacer',
    //     markers: true,
    //     start: 'top bottom',
    //     end:  '+=400',
    //     onScrubComplete: ({ progress, direction }) => {
    //       if (progress === 1 && direction === 1) {
    //         gsap.to('.pinned', { y: '-100vw' })
    //       }
    //     },
    //   }
    // })
    // loaded.value = true
    // gsap.to('.loadingWorks', {
    //   opacity: 0,
    //   duration: 1,
    // })
    // gsap.to('.content', {
    //   opacity: 1,
    //   duration: 1,
    // })
    gsap.to('#container2', {
      opacity: 1,
      duration: 1,
    })
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  pushTo();
  document.documentElement.style.overflowY = 'scroll'
});

router.afterEach(() => {
  pushTo();
})

onUnmounted(() => {
  ScrollTrigger.killAll();
  gsap.to('.background', {
    opacity: 1,
  })
  // When moving between projects the next page may already be mounted;
  // only restore scrolling if no project page is left.
  if (!document.querySelector('#container2')) {
    ; (document.querySelector('#__nuxt') as HTMLDivElement).style.overflowY =
      'initial'
  }
  mm.revert()
  // store.$patch({
  //   loadWorks: 0,
  // })
})

function next() {
  navigateTo({ path: nextWork.value })
}

function onError() {
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    fatal: true
  })
}
</script>

<style scoped>
.hero {
  mask-image: linear-gradient(to bottom,
      rgb(0 0 0 / 100%) 80%,
      rgb(0 0 0 / 0%));
}
</style>
