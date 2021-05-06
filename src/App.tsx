import { defineComponent, ref, Ref, reactive, watchEffect } from 'vue'
import { createUseStyles } from 'vue-jss'

import MonacoEditor from './components/MonacoEditor'

import demos from './demos'

import SchemaForm from '../lib'

// ts定义类型的方式
type Schema = any
type UISchema = any

// ts定义函数需要定义类型
function toJson(data: any) {
  return JSON.stringify(data, null, 2)
}

// css in js
const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
})

export default defineComponent({
  // vue3 jsx编程入口函数
  setup() {
    // 设置一个数字变量，注意这里要声明泛型
    const selectedRef: Ref<number> = ref(0)
    /**
     * 另一种设置变量的方法，注意这里声明object要定义类型，这里的Schema和UISchema是已经定义好的type，这里如果可能为null需要增加或运算，尽量不适用any
     */
    const demo: {
      schema: Schema | null
      data: any
      uiSchema: UISchema | null
      schemaCode: string
      dataCode: string
      uiSchemaCode: string
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
    })

    // 当属性值发生变化时，会触发这里的watchEffect
    watchEffect(() => {
      // 当selectedRef发生变化时重新给demo赋值
      const index = selectedRef.value
      const d = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJson(d.schema)
      demo.dataCode = toJson(d.default)
      demo.uiSchemaCode = toJson(d.uiSchema)
    })

    // 定义一个没有默认值的属性
    const methodRef: Ref<any> = ref()
    // 定义css in js 的 object
    const classesRef = useStyles()
    // 改变demo值的事件函数
    const handleChange = (v: any) => {
      demo.data = v
      demo.dataCode = toJson(v)
    }
    // 注意这里ts可以指定默认值
    function handleCodeChange(
      filed: 'schema' | 'data' | 'uiSchema',
      value: string,
    ) {
      try {
        const json = JSON.parse(value)
        demo[filed] = json(
          // 注意这里as的用法，否则后面可能没有办法调用，这里还需要注意一下
          demo as any,
        )[`${filed}Code`] = value
      } catch (err) {
        // some thing
      }
    }

    // 二次封装的方法
    const handleSchemaChange = (v: string) => handleCodeChange('schema', v)
    const handleDataChange = (v: string) => handleCodeChange('data', v)
    const handleUISchemaChange = (v: string) => handleCodeChange('uiSchema', v)

    return () => {
      // 所有css in js
      // ref的值需要通过value获取值
      const classes = classesRef.value
      const selected = selectedRef.value

      console.log(methodRef)

      return (
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>

          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>
            <div class={classes.form}>
              <SchemaForm
                schema={demo.schema}
                onChange={handleChange}
                value={demo.data}
              />
            </div>
          </div>
        </div>
      )
    }
  },
})
