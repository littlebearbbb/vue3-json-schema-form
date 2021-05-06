import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      return <div>{props.msg}</div>
    }
  },
})
