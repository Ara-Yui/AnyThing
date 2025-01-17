import { PropType } from "vue";
import { AnyBaseModel } from "./AnyBaseModel";

export function AnyFormFieldProps<T>(value: T | undefined = undefined){
  return {
    modelValue: {
      type: undefined as unknown as PropType<T>,
      default: value,
    },
    /**
     * # 传入的修饰符
     */
    modelModifiers: {
      type: Object,
      default: () => ({}),
    },
    /**
     * # 传入的实体类
     * 如同时传入了```modifier```或```v-model```指令的```modifier``` 则自动生成兜底的```placeholder```等信息
     */
    entity: {
      type: Function as unknown as PropType<AnyBaseModel>,
      default: undefined,
    },
    /**
     * # 传入的提示占位符
     */
    placeholder: {
      type: String,
      default: undefined,
    },
    /**
     * # 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * # 是否圆角
     * @description 仅在```type```为```text ， textarea```时生效
     * @default false
     */
    round: {
      type: Boolean,
      default: false,
    },
  }
}

