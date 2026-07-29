import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
 afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

  it('shows the dealership welcome screen', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /find your next drive/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows the login form when the user clicks sign in', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: /sign in to your account/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows the registration form when the user clicks create account', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: /create your account/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    ).toBeInTheDocument()
  })

  it('submits registration details to the backend', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'user-123',
        email: 'new@example.com',
        role: 'USER',
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    )

    await user.type(
      screen.getByLabelText(/email address/i),
      'new@example.com',
    )

    await user.type(
      screen.getByLabelText(/^password$/i),
      'Password123',
    )

    await user.click(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'new@example.com',
            password: 'Password123',
          }),
        },
      )
    })

    expect(
      await screen.findByText(/registration successful/i),
    ).toBeInTheDocument()
  })
it('logs in, stores the token and opens the inventory dashboard', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      access_token: 'test-jwt-token',
      token_type: 'bearer',
    }),
  })

  vi.stubGlobal('fetch', fetchMock)

  const user = userEvent.setup()
  render(<App />)

  await user.click(
    screen.getByRole('button', {
      name: /sign in/i,
    }),
  )

  await user.type(
    screen.getByLabelText(/email address/i),
    'user@example.com',
  )

  await user.type(
    screen.getByLabelText(/^password$/i),
    'Password123',
  )

  await user.click(
    screen.getByRole('button', {
      name: /sign in/i,
    }),
  )

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'Password123',
        }),
      },
    )
  })

  expect(localStorage.getItem('access_token')).toBe('test-jwt-token')

  expect(
    await screen.findByRole('heading', {
      name: /vehicle inventory/i,
    }),
  ).toBeInTheDocument()
})
it('loads and displays vehicles for an authenticated user', async () => {
  localStorage.setItem('access_token', 'test-jwt-token')

  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 'vehicle-123',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: '25000.00',
        quantity: 3,
      },
    ],
  })

  vi.stubGlobal('fetch', fetchMock)

  render(<App />)

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/vehicles',
      {
        headers: {
          Authorization: 'Bearer test-jwt-token',
        },
      },
    )
  })

  expect(
    await screen.findByRole('heading', {
      name: /toyota corolla/i,
    }),
  ).toBeInTheDocument()

  expect(screen.getByText('Sedan')).toBeInTheDocument()
  expect(screen.getByText('$25,000.00')).toBeInTheDocument()
  expect(screen.getByText(/3 in stock/i)).toBeInTheDocument()
})
})