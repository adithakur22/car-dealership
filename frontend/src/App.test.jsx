import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
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
})