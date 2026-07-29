const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function postAuthRequest(path, credentials, fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data.detail === 'string' ? data.detail : fallbackMessage

    throw new Error(message)
  }

  return data
}

export function registerUser(credentials) {
  return postAuthRequest(
    '/api/auth/register',
    credentials,
    'Registration failed',
  )
}

export function loginUser(credentials) {
  return postAuthRequest('/api/auth/login', credentials, 'Login failed')
}

export async function getVehicles(token) {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : 'Unable to load vehicles'

    throw new Error(message)
  }

  return data
}