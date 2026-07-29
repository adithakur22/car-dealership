import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
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
})