<template>
  <el-container>
    <el-aside>
      <el-button type="primary" @click="generateData">生成数据</el-button>
      <el-button type="primary" @click="start">start</el-button>
      <el-button type="primary" @click="stop">stop</el-button>
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
    <div class="right-content">
      <el-form
          ref="selectNode"
          :model="selectNode"
          label-position="right"
          label-width="50px"
          size="mini"
          style="margin: 5px"
      >
        <el-form-item label="id">
          <el-input v-model="selectNode.id" :disabled="true" class="right-content-input"/>
        </el-form-item>
        <el-form-item label="label">
          <el-input v-model="selectNode.label" class="right-content-input"/>
        </el-form-item>
        <el-form-item label="type">
          <el-select v-model="selectNode.type" class="right-content-input">
            <el-option
                v-for="item in nodeType"
                :value="item.value"
                :label="item.label"
                :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="x">
          <el-input v-model="selectNode.x" class="right-content-input"/>
        </el-form-item>
        <el-form-item label="y">
          <el-input v-model="selectNode.y" class="right-content-input"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateNode">更新</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
import G6 from '@antv/g6'
// import graph from "@/store/modules/graph";
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
      nodeType: [
        {
          value: 'circle',
          label: '圆形'
        },
        {
          value: 'rect',
          label: '矩形'
        },
        {
          value: 'ellipse',
          label: '椭圆'
        },
        {
          value: 'diamond',
          label: '菱形'
        },
        {
          value: 'triangle',
          label: '三角形'
        },
        {
          value: 'star',
          label: '星形'
        },
        {
          value: 'image',
          label: '图片'
        },
        {
          value: 'modelRect',
          label: '卡片'
        },
        {
          value: 'donut',
          label: '甜甜圈'
        },
      ],
      draggingCompo: undefined,
      graphData: {nodes: []},
      selectNode: {},
      interval: []
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
    start() {
      this.interval.push(setInterval(() => {
        this.graphData.nodes.map(item => item.label += '!')
        this.graph.refresh()
      }, 100))
    },
    stop() {
      this.interval.forEach(item => clearInterval(item))
    },
    generateData() {
      // svg模式和canvas模式性能差距巨大
      // svg一次性渲染千个节点需要5s，canvas渲染万个节点都是瞬间
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          this.graphData.nodes.push({
            id: i + j + Math.random() + '',
            type: 'circle',
            label: 'label',
            x: i + 50 * i,
            y: j + 50 * j
          })
        }
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
        // renderer: 'svg',
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
                  // 无法获取、调用vue的data和method
                  html: `
<div style="height: 25px;width: 100px;border: 1px solid mediumpurple;border-radius: 5px" onclick="console.log('dom label click')">
    <span>${cfg.label}</span>
</div>
`,
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: 'dom-label',
                draggable: true,
              });
            }
          }
      )
      this.graph.on('node:click', evt => {
        console.log('g6 node click', evt)
        this.selectNode = evt.item._cfg.model
      })
    },
    updateNode() {
      this.graph.refresh()
    },
  },
  mounted() {
    this.initGraph()
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

.right-content {
  float: right;
  height: 100%;
  width: 200px;
  background-color: #D3DCE6;
  color: #333;
}

.el-input--mini {
  text-align: left;
  width: 120px;
}
</style>