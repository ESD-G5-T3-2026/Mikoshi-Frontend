import apiClient from './apiClient'

const PATH = '/personnel'

export async function getPersonnel(clubId) {
  const response = await apiClient.get(`${PATH}/${clubId}`)
  return response.data
}

export async function addPersonnel(clubId, payload) {
  const response = await apiClient.post(`${PATH}/${clubId}`, payload)
  return response.data
}

export async function removePersonnel(clubId, body) {
  const response = await apiClient.delete(`${PATH}/${clubId}`,  { data: body })
  return response.data
}