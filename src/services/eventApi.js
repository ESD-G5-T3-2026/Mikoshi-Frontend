import apiClient from './apiClient'

const PATH = '/events'

export async function getEvents(clubId) {
  const response = await apiClient.get(`${PATH}/GetAllEventsByClub`, {
    params: {
      club_id: clubId,
    },
  })
  return response.data
}

export async function createEvent(payload) {
  const response = await apiClient.post(`/events/CreateEvent`, payload)
  return response.data
}

export async function updateEventStatus(payload) {
  const response = await apiClient.put(`${PATH}/UpdateEvent`, payload)
  return response.data
}
