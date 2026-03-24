import apiClient from './apiClient'

const PATH = "/insights"
const MANAGE_PATH = '/manage-insights'

export async function addInsights(payload) {
  const response = await apiClient.post(`${PATH}`, payload)
  return response.data
}

export async function summarizeInsights(payload) {
  const response = await apiClient.post(`${MANAGE_PATH}/summary`, payload)
  return response.data
}