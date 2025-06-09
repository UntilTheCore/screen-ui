
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch, type CSSProperties, type PropType } from "vue";
import { debounce } from "lodash";

type IAutoScale =
    | boolean
    | {
      x?: boolean
      y?: boolean
    };

type Props = {
  width?: number
  height?: number
  fullScreen?: boolean
  autoScale?: IAutoScale
  delay?: number
  boxStyle?: CSSProperties
  wrapperStyle?: CSSProperties
};

const emit = defineEmits(["mapOnLoad"]);

interface IState {
  originalWidth: string | number
  originalHeight: string | number
  observer: null | MutationObserver
  visibleContent: boolean
  width?: string | number
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  width: 1920,
  height: 1080,
  fullScreen: false,
  autoScale: true,
  delay: 500,
  boxStyle: () => ({}),
  wrapperStyle: () => ({})
});

const state = reactive<IState>({
  width: 0,
  height: 0,
  originalWidth: 0,
  originalHeight: 0,
  observer: null,
  visibleContent: false
});

const styles: Record<string, CSSProperties> = {
  box: {
    overflow: "hidden",
    backgroundSize: `100% 100%`,
    background: `#000`,
    width: `100vw`,
    height: `100vh`
  },
  wrapper: {
    transitionProperty: `all`,
    transitionTimingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDuration: `500ms`,
    position: `relative`,
    overflow: `hidden`,
    zIndex: 100,
    transformOrigin: `left top`
  }
};

const screenWrapper = ref<HTMLElement>();
const RefResponsiveContainer = ref<HTMLElement>();


const onResize = debounce(async () => {
  await initSize();
  updateSize();
  updateScale();
}, props.delay);

watch(
  () => props.autoScale,
  async (newVal: any) => {
    if (newVal) {
      onResize();
      addListener();
    } else {
      clearListener();
      clearScreenWrapperStyle();
    }
  }
);

/**
 * 初始化大屏容器宽高
 */
async function initSize() {
  return new Promise<void>((resolve) => {
    RefResponsiveContainer.value!.scrollLeft = 0;
    RefResponsiveContainer.value!.scrollTop = 0;
    nextTick(() => {
      // region 获取大屏真实尺寸
      if (props.width && props.height) {
        state.width = props.width;
        state.height = props.height;
      } else {
        state.width = screenWrapper.value?.clientWidth;
        state.height = screenWrapper.value?.clientHeight;
      }
      // endregion

      // region 获取画布尺寸
      if (!state.originalHeight || !state.originalWidth) {
        state.originalWidth = window.screen.width;
        state.originalHeight = window.screen.height;
      }
      // endregion
      resolve();
    });
  });
}

/**
 * 更新大屏容器宽高
 */
function updateSize() {
  if (state.width && state.height) {
    screenWrapper.value!.style.width = `${ state.width }px`;
    screenWrapper.value!.style.height = `${ state.height }px`;
  } else {
    screenWrapper.value!.style.width = `${ state.originalWidth }px`;
    screenWrapper.value!.style.height = `${ state.originalHeight }px`;
  }
}

function clearScreenWrapperStyle() {
  screenWrapper.value!.style.transform = "";
  screenWrapper.value!.style.margin = "";
}

function autoScaleScreen(scale: number) {
  state.visibleContent = true;
  const domWidth = screenWrapper.value!.clientWidth;
  const domHeight = screenWrapper.value!.clientHeight;
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;
  screenWrapper.value!.style.transform = `scale(${ scale },${ scale })`;
  let mx = Math.max((currentWidth - domWidth * scale) / 2, 0);
  let my = Math.max((currentHeight - domHeight * scale) / 2, 0);

  if (typeof props.autoScale === "object") {
    mx = props.autoScale.x || 0;
    my = props.autoScale.y || 0;
  }

  screenWrapper.value!.style.margin = `${ my }px ${ mx }px`;
}

function updateScale() {
  // 获取真实视口尺寸
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;
  // 获取大屏最终的宽高
  const realWidth = state.width || state.originalWidth;
  const realHeight = state.height || state.originalHeight;
  // 计算缩放比例
  const widthScale = currentWidth / +realWidth;
  const heightScale = currentHeight / +realHeight;
  // 若要铺满全屏，则按照各自比例缩放
  if (props.fullScreen) {
    screenWrapper.value!.style.transform = `scale(${ widthScale },${ heightScale })`;
    return false;
  }
  // 按照宽高最小比例进行缩放
  const scale = Math.min(widthScale, heightScale);
  autoScaleScreen(scale);
}

function clearListener() {
  window.removeEventListener("resize", onResize);
}

function addListener() {
  window.addEventListener("resize", onResize);
}

onMounted(() => {
  nextTick(async () => {
    await initSize();
    updateSize();
    updateScale();
    addListener();
  });
});

onUnmounted(() => {
  clearListener();
});

</script>

<template>
  <div
    ref="RefResponsiveContainer"
    :style="{ ...styles.box, ...boxStyle }"
    class="v-screen-box"
  >
    <div
      id="screen-wrapper"
      ref="screenWrapper"
      :style="{ ...styles.wrapper, ...wrapperStyle }"
      class="screen-wrapper"
    >
      <slot v-if="state.visibleContent"></slot>
    </div>
  </div>
</template>

<style scoped>
.screen-content {
  width: 100%;
  height: 100%;
}
</style>
