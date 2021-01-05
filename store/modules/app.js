import { getHouseId, setHouseId } from '@/utils/index.js'

const state = {
  houseId: getHouseId()
}

const getters = {}

const mutations = {
  // 更新店铺ID
  UPDATE_HOUSE_ID(state, houseId) {
    state.houseId = houseId
    setHouseId(houseId)
    console.log('state.houseId = ', state.houseId)
  }
}

const actions = {
  updateHouseId({ commit }, houseId) { commit('UPDATE_HOUSE_ID', houseId) },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
