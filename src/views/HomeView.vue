<template>
  <el-container>
    <el-aside>
      <el-button type="primary" @click="initGraph">初始化</el-button>
      <el-button type="primary" @click="generateData">生成数据</el-button>
      <el-button type="primary" @click="changeLabel">label变化</el-button>
      <div class="component-list">
        <div
            class="component-item"
            v-for="item in compoList"
            :draggable="item.draggable"
            @dragstart="dragCompo(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </el-aside>
    <el-main>
      <div
          id="container"
          @drop="dropCompo"
      ></div>
    </el-main>
  </el-container>
</template>

<script>
import G6 from '@antv/g6'
// import {mapGetters} from 'vuex'

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      compoList: [
        {
          id: 'label',
          type: 'label',
          name: 'label',
          label: 'label',
          draggable: 'true',
          data: {
            msg: 'I am a label.'
          }
        },
        {
          id: 'button',
          type: 'rect',
          name: 'button',
          label: 'button',
          draggable: 'true',
          data: {
            msg: 'I am a button.'
          }
        },
        {
          id: 'image',
          type: 'rect',
          name: 'image',
          label: 'image',
          draggable: 'true',
          data: {
            msg: 'I am an image.'
          }
        }
      ],
      draggingCompo: undefined,
      graphData: {nodes: []}
    }
  },
  computed: {
    // ...mapGetters(['graphData']),
  },
  methods: {
    dragCompo(item) {
      console.log('drag')
      this.draggingCompo = item
    },
    dropCompo(evt) {
      console.log('drop')
      // 推入当前组件信息，并重新渲染graph
      if (this.draggingCompo) {
        let node = {
          // 时间戳当做id
          id: new Date().getTime() + '',
          type: this.draggingCompo.type,
          label: this.draggingCompo.label,
          x: evt.offsetX,
          y: evt.offsetY
        }
        this.graphData.nodes.push(node)
        this.graph.data(this.graphData)
        this.graph.render()
      }
    },
    changeLabel() {
      this.graphData.nodes.map(item => item.label += '!')
      this.graph.refresh()
    },
    generateData() {
      // svg模式和canvas模式性能差距巨大
      // svg一次性渲染千个节点需要5s，canvas渲染万个节点都是瞬间
      for (let i = 0; i < 10000; i++) {
        this.graphData.nodes.push({
          id: i + '',
          type: 'circle',
          label: 'label',
          x: i + 100,
          y: i + 100
        })
      }
      this.graph.data(this.graphData)
      this.graph.render()
    },
    initGraph() {
      console.log('graph create')
      this.graph = new G6.Graph({
        container: 'container',
        fitView: true,
        renderer: 'canvas',
        autoPaint: true,
        modes: {
          default: ['drag-node', 'drag-canvas', 'click-select', 'scroll-canvas']
        }
      })
      // 注册组件
      G6.registerNode(
          'label',
          {
            draw: (cfg, group) => {
              return group.addShape('dom', {
                attrs: {
                  width: 150,
                  height: 30,
                  // DOM's html
                  // dom无法使用element组件，无法响应G6事件
                  html: `
<div style="height: 25px;width: 100px;border: 1px solid mediumpurple;border-radius: 5px">
    <span style="margin-top: 5px;margin-bottom: 5px;margin-right: 5px;border: 1px solid rebeccapurple;height: 100%;width: 30px">我是</span>
    <span style="margin-top: 5px;margin-bottom: 5px;border: 1px solid rebeccapurple;height: 100%;width: 70px">${cfg.label}</span>
</div>
`,
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: 'dom-shape',
                draggable: true,
              });
            }
          }
      )
    }
  },
  mounted() {
  }
}
</script>


<style>
.el-container {
  height: 100%;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

#container {
  height: 100%;
  width: 100%;
}

.component-item {
  border: 1px solid hotpink;
  border-radius: 5px;
  width: 100px;
  margin: 5px;
  text-align: center;
}
</style>