export function getRoleFromToken(token) {
  try {
    if (!token) {
      return 'USER'
    }

    const payload = token.split('.')[1]

    if (!payload) {
      return 'USER'
    }

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '=',
    )

    const decodedPayload = JSON.parse(window.atob(paddedPayload))

    return String(decodedPayload.role || 'USER').toUpperCase()
  } catch {
    return 'USER'
  }
}