<template>
  <div class="search">
    <div class="title">
      <span>组件</span>
      <n-icon :component="Filter" />
    </div>
    <div class="input-group">
      <div class="input-group-input">
        <n-input 
          v-model:value="searchValue"
          placeholder="组件名称..."
          @focus="isFocus = true"
          @blur="isFocus = false"
          @input="emits('change', searchValue)"
        />
      </div>
      <n-tooltip>
        <template #trigger>
          <AButton
            class="input-group-button"
            :style="isFocus ? { width: 0, padding: 0 } : ''"
            :level="EButtonLevel.TERTIARY"
            :icon="columns === 1 ? SquareSharp : Grid "
            @click="handleGridChange"
          />
        </template>
        {{ `${columns}列` }}
      </n-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { AButton } from '@/components/UI'
import { Filter, Grid, SquareSharp } from '@vicons/ionicons5'
import { EButtonLevel } from '@/enum/EButtonLevel'

/* eslint-disable-next-line */
const emits = defineEmits<{
  (event: 'change', data: string): void,
  (event: 'columnsChange', data: number): void,
}>()

const isFocus = ref<boolean>(false)
const columns = ref(1)
const searchValue = ref('')

function handleGridChange () {
  columns.value >= 4 
    ? columns.value = 1
    : columns.value += 1
  emits('columnsChange', columns.value)
}

</script>
<style lang="less" scoped>
.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0 5px 10px;
  background-color: var(--table-color);
  backdrop-filter: blur(17.5px);
  border-radius: 10px 10px 0 0;
  box-shadow: var(--box-shadow-2);
  border-bottom: 1px solid var(--border-color);
  transition: all .3s var(--cubic-bezier-ease-in-out);
}

.title {
  display: flex;
  align-items: center;
}

.input-group {
  display: flex;
  gap: 10px;
  width: 180px;
  overflow: hidden;
  justify-content: space-between;

  & &-button {
    transition: all .3s;
  }
}
</style>
