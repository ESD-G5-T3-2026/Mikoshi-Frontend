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
