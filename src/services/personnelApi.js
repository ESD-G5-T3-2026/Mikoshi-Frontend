import apiClient from './apiClient'

const PATH = '/personnel'

export async function getPersonnel(clubId) {
  const response = await apiClient.get(`${PATH}/${clubId}`)
  return response.data
}