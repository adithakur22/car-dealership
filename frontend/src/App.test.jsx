import { render, screen } from '@testing-library/react'
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
})