/* eslint-disable no-unused-vars */
import axios from 'axios'
import * as types from '../mutation-types'

// state
export const state = {
  usersAllowed: null,
  groupsModerating: null
}

// getters
export const getters = {
  usersAllowed: state => state.usersAllowed,
  groupsModerating: state => state.groupsModerating
}

// mutations
export const mutations = {
  [types.FETCH_USERS_ALLOWED_SUCCESS] (state, { usersAllowed }) {
    state.usersAllowed = usersAllowed
  },

  [types.FETCH_GROUPS_MODERATING_SUCCESS] (state, { groupsModerating }) {
    state.groupsModerating = groupsModerating
  }
}

// actions
export const actions = {
  async fetchAllowedUsers ({ commit }) {
    try {
      const { data } = await axios.get('/api/users-allowed')
      commit(types.FETCH_USERS_ALLOWED_SUCCESS, { usersAllowed: data })
    } catch (e) {
      commit(types.FETCH_USERS_ALLOWED_FAILURE)
    }
  },
  async fetchGroupsModerating ({ commit }) {
    try {
      const { data } = await axios.get('/api/groups-moderating')
      commit(types.FETCH_GROUPS_MODERATING_SUCCESS, { groupsModerating: data })
    } catch (e) {
      commit(types.FETCH_GROUPS_MODERATING_FAILURE)
    }
  },

  addAllowedUserToGroup ({ commit }, payload) {
    axios.post('/api/add-user-to-group', payload)
  },

  removeAllowedUserFromGroup ({ commit }, payload) {
    axios.post('/api/remove-user-from-group', payload)
  },

  updateUsers ({ commit }, payload) {
    try {
      return axios.patch('/api/update-allowed-users', payload )
    } catch (e) {
      return e
    }
  },

  createUsers ({ commit }, payload) {
    try {
      return axios.post('/api/create-users', payload )
    } catch (e) {
      return e
    }
  },

  deleteUsers ({ commit }, payload) {
    try {
      return axios.patch('/api/delete-allowed-user', payload )
    } catch (e) {
      return e
    }
  }

}
