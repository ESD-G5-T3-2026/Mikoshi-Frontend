import apiClient from './apiClient'

const PATH = '/meeting'

export async function getMeetings(clubId) {
  const response = await apiClient.get(`${PATH}/${clubId}`)
  return response.data
}
export async function createMeeting(clubId, payload) {
  const response = await apiClient.post(`${PATH}/${clubId}`, payload)
  return response.data
}

