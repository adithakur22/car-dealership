const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function registerUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed')
  }

  return data
}