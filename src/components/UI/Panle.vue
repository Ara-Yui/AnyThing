<template>
  <n-layout 
    style="height: 100%;"
    has-sider
    :sider-placement="siderPlacement"
  >
    <n-layout-sider
      v-if="!hideSlider&&showLeftSlider"
      bordered
      show-trigger="bar"
      collapse-mode="transform"
      content-style="padding: 16px;"
      :class="customClassLeftSlider"
      :width="300"
      :collapsed-width="0"
      :on-after-leave="resize"
      :on-after-enter="resize"
    >
      <slot name="slider-left" />
    </n-layout-sider>
    <n-layout-content>
      <slot />
    </n-layout-content>
    <n-layout-sider  
      v-if="!hideSlider&&showRightSlider"
      bordered
      show-trigger="bar"
      collapse-mode="transform"
      content-style="padding: 16px;"
      :width="400"
      :collapsed-width="0"
      :on-after-leave="resize"
      :on-after-enter="resize"
    >
      <slot name="slider-right" />
    </n-layout-sider>
  </n-layout>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * # 是否隐藏全部侧边栏
   */  
  hideSlider: {
    type: Boolean,
    default: false,
  },
  /**
   * # 是否显示右侧侧边栏
   */
  showRightSlider: {
    type: Boolean,
    default: false,
  },
  /**
   * # 是否显示左侧侧边栏
   */
  showLeftSlider: {
    type: Boolean,
    default: false,
  },
  /**
   * # 自定义左侧侧边栏样式
   */
  customClassLeftSlider: {
    type: [String, Array<string>],
    default: '',
  },
})
const emits = defineEmits(['resize'])

const siderPlacement = computed(() => {
  if (props.hideSlider) {
    return undefined
  }
  if (props.showLeftSlider && props.showRightSlider) {
    return 'left'
  }
  if (!props.showLeftSlider && props.showRightSlider) {
    return 'right'
  }
  if (props.showLeftSlider && !props.showRightSlider) {
    return 'left'
  }
  return 'left'
})

const resize = () => {
  emits('resize')
}
</script>
<style lang="less" scoped>

</style>
