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
export async function purchaseVehicle(token, vehicleId) {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/${vehicleId}/purchase`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : 'Unable to purchase vehicle'

    throw new Error(message)
  }

  return data
}
export async function createVehicle(token, vehicle) {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicle),
  })

  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : 'Unable to add vehicle'

    throw new Error(message)
  }

  return data
}
export async function deleteVehicle(token, vehicleId) {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/${vehicleId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    let message = 'Unable to delete vehicle'

    try {
      const data = await response.json()

      if (typeof data.detail === 'string') {
        message = data.detail
      }
    } catch {
      // Keep the fallback message when the response has no JSON.
    }

    throw new Error(message)
  }
}