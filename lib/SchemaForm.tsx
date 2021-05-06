import { defineComponent, PropType } from 'vue'

import { Schema } from './types'

import SchemaItem from './SchemaItem'

export default defineComponent({
  // 注意这里props定义ts类型的方法，是通过PropType的泛型实现
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    // 注意这里定义Function的ts类型
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  name: 'SchemaForm',
  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    return () => {
      const { schema, value } = props
      return (
        <SchemaItem schema={schema} value={value} onChange={handleChange} />
      )
    }
  },
})
