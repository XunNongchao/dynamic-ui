import G6 from '@antv/g6'

const state = {
    graph: undefined,
    graphData: []
}

const mutations = {
    INIT_GRAPH: (state, config) => {
        state.graph = new G6.Graph(config)
    },
    RENDER: state => {
        if (state.graph) state.graph.render()
    },
    GRAPH_UPDATE: (state, data) => {
        state.graphData.nodes.push(data)
        if (state.graph) state.graph.data(data)
    }
}

const actions = {
    initGraph({commit}, {config}) {
        commit('INIT_GRAPH', config)
    },
    render({commit}) {
        commit('RENDER')
    },
    graphUpdate({commit}, data) {
        commit('GRAPH_UPDATE', data)
    }
}

export default {
    state,
    mutations,
    actions
}