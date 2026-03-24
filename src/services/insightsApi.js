import apiClient from './apiClient'

const PATH = "/insights"
const MANAGE_PATH = '/manage-insights'

export async function getInsights(clubId, eventId) {
  const response = await apiClient.get(`${PATH}?clubId=${clubId}&eventIds=${eventId}`)
  return response.data
}

export async function addInsights(payload) {
  const response = await apiClient.post(`${PATH}`, payload)
  return response.data
}

export async function updateInsights(id, clubId, payload) {
  await apiClient.patch(`${PATH}/${id}?clubId=${clubId}`, payload)
}

export async function summarizeInsights(payload) {
  const response = await apiClient.post(`${MANAGE_PATH}/summary`, payload)
  return response.data
}