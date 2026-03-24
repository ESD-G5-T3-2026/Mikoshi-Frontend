import apiClient from './apiClient'

const PATH = '/manage-insights'

export async function summarizeInsights(payload) {
  const response = await apiClient.post(`${PATH}/summary`, payload)
  return response.data
}