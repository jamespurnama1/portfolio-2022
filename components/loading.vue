<template>
  <div class="loading fixed z-[1000] w-screen h-safe-height flex justify-center items-center flex-col-reverse">
    <transition name="fade">
      <div v-if="!fullReady || (routePath !== '/' && checkReady < 100)" ref="anim"
        class="anim absolute flex flex-col-reverse items-center justify-center m-auto text-black dark:text-white">
        <p class="mt-8 text-xl 2xl:text-4xl" v-if="Math.round(checkReady)">{{ Math.min(Math.round(checkReady) - 1, 99)
        }}%</p>
        <p v-else class="mt-8 text-xl 2xl:text-4xl">0%</p>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="fullReady && once" class="font-medium text-3xl md:text-5xl 2xl:text-7xl text-black dark:text-white">
        <div class="relative overflow-hidden">
          <h2 class="content__paragraph" data_splitting>grain traction</h2>
        </div>
        <div class="relative overflow-hidden">
          <h2 class="content__paragraph" data_splitting>&amp; make some</h2>
        </div>
        <div class="relative overflow-hidden">
          <h2 class="content__paragraph" data_splitting>beautiful noise.</h2>
        </div>
        <button class="relative arrow-button group overflow-hidden flex" aria-label="Continue"
          v-posthog-capture="'continue'" @click="() => {
            next()
            req()
          }">
          <img src="@/assets/arrow.svg" alt="Arrow Icon"
            class="dark:invert h-8 md:h-12 2xl:h-18 w-auto transition-none group-hover:translate-x-full group-active:translate-x-full group-hover:transition-transform group-hover:duration-500 group-hover:ease-in-out" />
          <img src="@/assets/arrow.svg" alt="Arrow Icon"
            class="dark:invert h-8 md:h-12 2xl:h-18 w-auto transition-none -translate-x-full absolute group-hover:translate-x-0 group-active:translate-x-0 group-hover:transition-transform group-hover:duration-500 group-hover:ease-in-out" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '~/store'

const anim = ref()
const route = useRoute()
const props = defineProps(['checkReady', 'ready'])
const emit = defineEmits(['next'])
const { $lottie, $Splitting } = useNuxtApp()
const { $gsap } = useNuxtApp()
const store = useStore()
const routePath = computed(() => route.path)

const timelineSettings = {
  staggerValue: 0.014,
  charsDuration: 2,
}

function animateInit() {
  const timeline = $gsap.timeline({ paused: true }).to(['.char', 'button'], {
    ease: 'Power3.easeIn',
    y: '-100%',
    duration: timelineSettings.charsDuration,
    opacity: 0,
    stagger: timelineSettings.staggerValue,
    delay: 1,
  })
  timeline.reverse(0)
}

const once = ref(true)

function req() {
  try {
    ; (DeviceOrientationEvent as any).requestPermission()
  } catch (error) { }
}

function next() {
  window.removeEventListener('keydown', () => { })
  $gsap.to('.loading', {
    autoAlpha: 0,
  })
  once.value = false
  emit('next')
}

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if ((fullReady && event.key === 'Enter') || event.key === 'Space') {
      next()
    }
  })

  $Splitting({
    whitespace: true,
    target: document.querySelectorAll('h2.content__paragraph'),
  })

  // loadAnim();
})

watch(anim, () => {
  // await nextTick();
  loadAnim()
})

const loadAnim = () => {
  $lottie.loadAnimation({
    container: anim.value,
    loop: true,
    autoplay: true,
    path: './loading.json',
    rendererSettings: {
      className: 'lottieLoading',
    },
  })
}

const fullReady = computed(() => props.checkReady >= 100 && props.ready)

watch(fullReady, () => {
  if (fullReady.value && once.value) {
    animateInit()
  } else if (fullReady.value && !once.value) {
    next()
  } else if (!fullReady.value) {
    $gsap.to('.loading', {
      autoAlpha: 1,
      duration: 0.1,
    })
  }
})
</script>

<style>
/* stylelint-disable-next-line selector-class-pattern */
svg.lottieLoading {
  max-width: 6em;
}

<style lang="scss" scoped>
.loading {
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  height: calc(100vh - env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;

  .anim {
    position: absolute;
    display: flex;
    flex-flow: column-reverse;
    margin: auto;
    align-items: center;
    justify-content: center;

    p {
      margin-top: 2em;
      color: var(--color);
    }
  }

  .content-item {
    position: relative;
    overflow: hidden;

    &:last-child {
      // same width as the arrow button inside
      width: 5.74em;

      @include min-media(desktop) {
        width: 15.31em;
      }
    }

    h2 {
      font-size: 3em;

      @include min-media(desktop) {
        font-size: 8em;
      }
    }
  }

  button {
    height: 3em;
    width: 5.74em;
    border: none;
    mask-repeat: repeat-x;
    mask-position: 0 50%;
    mask-size: 5.74em 3em;
    mask-image: url("@/assets/arrow.svg");
    margin: 0;
    padding: 0;
    cursor: pointer;

    @keyframes next {
      from {
        mask-position: 0 50%;
      }

      to {
        mask-position: 5.74em 50%;
      }
    }

    @include min-media(desktop) {
      height: 8em;
      width: 15.31em;
      mask-size: 15.31em 8em;

      @keyframes next {
        from {
          mask-position: 0 50%;
        }

        to {
          mask-position: 15.31em 50%;
        }
      }
    }

    &:hover {
      animation: next 0.5s;
    }

    div {
      width: 100%;
      height: 100%;
      background-color: var(--color);
    }
  }
}
</style>