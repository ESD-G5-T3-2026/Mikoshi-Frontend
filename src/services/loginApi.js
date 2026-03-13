import apiClient from './apiClient'

const PATH = "/auth"

export async function login({ email, password }) {
  const response = await apiClient.post(PATH + '/login', { email, password })
  return response.data
}

export async function logoutApi() {
  const response = await apiClient.post(PATH +'/logout')
  return response.data
}

export async function getSession() {
  const response = await apiClient.get(PATH + '/check')
  return response.data
}
