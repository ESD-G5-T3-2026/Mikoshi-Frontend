import apiClient from './apiClient'

const PATH = '/meeting'
const COMPO_PATH = '/schedule-meeting'

export async function getMeetings(clubId) {
  const response = await apiClient.get(`${PATH}/${clubId}`)
  return response.data
}
export async function createMeeting(payload) {
  const response = await apiClient.post(`${COMPO_PATH}/schedule-meeting`, payload)
  return response.data
}

