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
const fetchMock = vi
  .fn()
  .mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      access_token: 'test-jwt-token',
      token_type: 'bearer',
    }),
  })
  .mockResolvedValueOnce({
    ok: true,
    json: async () => [],
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
it('filters vehicles by search text and category', async () => {
  localStorage.setItem('access_token', 'test-jwt-token')

  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 'vehicle-1',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: '25000.00',
        quantity: 3,
      },
      {
        id: 'vehicle-2',
        make: 'Toyota',
        model: 'Fortuner',
        category: 'SUV',
        price: '45000.00',
        quantity: 2,
      },
      {
        id: 'vehicle-3',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: '27000.00',
        quantity: 4,
      },
    ],
  })

  vi.stubGlobal('fetch', fetchMock)

  const user = userEvent.setup()
  render(<App />)

  expect(
    await screen.findByRole('heading', {
      name: /toyota corolla/i,
    }),
  ).toBeInTheDocument()

  expect(
    screen.getByRole('heading', {
      name: /toyota fortuner/i,
    }),
  ).toBeInTheDocument()

  expect(
    screen.getByRole('heading', {
      name: /honda civic/i,
    }),
  ).toBeInTheDocument()

  await user.type(
    screen.getByRole('searchbox', {
      name: /search vehicles/i,
    }),
    'Toyota',
  )

  expect(
    screen.queryByRole('heading', {
      name: /honda civic/i,
    }),
  ).not.toBeInTheDocument()

  await user.selectOptions(
    screen.getByRole('combobox', {
      name: /category/i,
    }),
    'SUV',
  )

  expect(
    screen.queryByRole('heading', {
      name: /toyota corolla/i,
    }),
  ).not.toBeInTheDocument()

  expect(
    screen.getByRole('heading', {
      name: /toyota fortuner/i,
    }),
  ).toBeInTheDocument()
})
it('purchases an available vehicle and disables out-of-stock purchases', async () => {
  localStorage.setItem('access_token', 'test-jwt-token')

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 'vehicle-1',
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: '25000.00',
          quantity: 2,
        },
        {
          id: 'vehicle-2',
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: '27000.00',
          quantity: 0,
        },
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'vehicle-1',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: '25000.00',
        quantity: 1,
      }),
    })

  vi.stubGlobal('fetch', fetchMock)

  const user = userEvent.setup()
  render(<App />)

  expect(
    await screen.findByRole('heading', {
      name: /toyota corolla/i,
    }),
  ).toBeInTheDocument()

  const availablePurchaseButton = screen.getByRole('button', {
    name: /purchase toyota corolla/i,
  })

  const unavailablePurchaseButton = screen.getByRole('button', {
    name: /purchase honda civic/i,
  })

  expect(availablePurchaseButton).toBeEnabled()
  expect(unavailablePurchaseButton).toBeDisabled()

  await user.click(availablePurchaseButton)

  await waitFor(() => {
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:8000/api/vehicles/vehicle-1/purchase',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-jwt-token',
        },
      },
    )
  })

  expect(await screen.findByText('1 in stock')).toBeInTheDocument()
})
})