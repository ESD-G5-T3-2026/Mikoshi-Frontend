import apiClient from './apiClient'

const PATH = '/personnel-assignment'
const ALLOCATION_PATH = '/allocate-manpower'


export async function getPersonnelAssignment(eventId) {
  const response = await apiClient.get(`${PATH}/assignments?event_id=${eventId}`)
  return response.data
}

export async function addPersonnelAssignment(payload) {
  const response = await apiClient.post(`${ALLOCATION_PATH}/allocate`, payload)
  return response.data
}


