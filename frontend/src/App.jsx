import { useEffect, useState } from 'react'

import { getRoleFromToken } from './utils/auth'

import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  loginUser,
  purchaseVehicle,
  registerUser,
} from './services/api'


function WelcomeScreen({ onSignIn, onCreateAccount }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xl font-bold tracking-tight">
            Drive<span className="text-cyan-400">Deck</span>
          </p>
          <p className="text-xs text-slate-400">Car Dealership</p>
        </div>

        <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Trusted inventory
        </span>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-5 inline-block rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Your journey starts here
          </p>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Find your next drive
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Search our inventory, compare available cars and purchase your
            favourite vehicle from one simple dashboard.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={onCreateAccount}
              className="rounded-xl border border-slate-600 px-7 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Create account
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/40">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-8 text-slate-950">
            <p className="text-sm font-semibold uppercase tracking-widest">
              Featured inventory
            </p>

            <p className="mt-16 text-4xl font-bold">Built for every road.</p>

            <p className="mt-3 max-w-sm text-slate-900/80">
              Sedans, SUVs, hatchbacks and more—all managed from one place.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-2xl font-bold text-cyan-300">100%</p>
              <p className="mt-1 text-xs text-slate-400">Verified</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-2xl font-bold text-cyan-300">24/7</p>
              <p className="mt-1 text-xs text-slate-400">Browsing</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-2xl font-bold text-cyan-300">Easy</p>
              <p className="mt-1 text-xs text-slate-400">Purchases</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AuthForm({ mode, onBack, onSwitch, onAuthenticated }) {
  const isLogin = mode === 'login'
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    setMessage('')
    setError('')
    setIsSubmitting(true)

    try {
      if (isLogin) {
        const data = await loginUser(credentials)

        localStorage.setItem('access_token', data.access_token)
        onAuthenticated()
      } else {
        await registerUser(credentials)
        setMessage('Registration successful. You can now sign in.')
        form.reset()
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          ← Back to welcome
        </button>

        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          DriveDeck
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h1>

        <p className="mt-2 text-slate-400">
          {isLogin
            ? 'Access the dealership inventory dashboard.'
            : 'Register to explore and purchase available vehicles.'}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="8"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          {message && (
            <p
              role="status"
              className="rounded-xl border border-emerald-800 bg-emerald-950 px-4 py-3 text-sm text-emerald-300"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Please wait...'
              : isLogin
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? 'New to DriveDeck?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  )
}

function VehicleForm({ onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const vehicle = {
      make: formData.get('make').trim(),
      model: formData.get('model').trim(),
      category: formData.get('category').trim(),
      price: Number(formData.get('price')).toFixed(2),
      quantity: Number(formData.get('quantity')),
    }

    setIsSubmitting(true)

    try {
      await onSubmit(vehicle)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8"
    >
      <section className="max-h-full w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-cyan-400">Admin inventory</p>

            <h2
              id="vehicle-form-title"
              className="mt-2 text-3xl font-bold"
            >
              Add a new vehicle
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close vehicle form"
            className="text-2xl text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="vehicle-make"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Make
              </label>

              <input
                id="vehicle-make"
                name="make"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="vehicle-model"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Model
              </label>

              <input
                id="vehicle-model"
                name="model"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="vehicle-category"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Category
            </label>

            <input
              id="vehicle-category"
              name="category"
              required
              placeholder="Sedan, SUV, Hatchback..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="vehicle-price"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Price
              </label>

              <input
                id="vehicle-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="vehicle-quantity"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Quantity
              </label>

              <input
                id="vehicle-quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save vehicle'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [purchasingVehicleId, setPurchasingVehicleId] = useState(null)
  const [deletingVehicleId, setDeletingVehicleId] = useState(null)
  const [purchaseMessage, setPurchaseMessage] = useState('')
  const [purchaseError, setPurchaseError] = useState('')
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const token = localStorage.getItem('access_token')
  const isAdmin = getRoleFromToken(token) === 'ADMIN'

  useEffect(() => {
    let isCancelled = false

    async function loadVehicles() {
      try {
        const data = await getVehicles(token)

        if (!Array.isArray(data)) {
          throw new Error('Invalid vehicle data received')
        }

        if (!isCancelled) {
          setVehicles(data)
        }
      } catch (requestError) {
        if (!isCancelled) {
          setError(requestError.message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadVehicles()

    return () => {
      isCancelled = true
    }
  }, [token])

  async function handleAddVehicle(vehicle) {
    setPurchaseMessage('')
    setPurchaseError('')

    try {
      const createdVehicle = await createVehicle(token, vehicle)

      setVehicles((currentVehicles) => [
        createdVehicle,
        ...currentVehicles,
      ])

      setIsAddFormOpen(false)

      setPurchaseMessage(
        `${createdVehicle.make} ${createdVehicle.model} added successfully.`,
      )
    } catch (requestError) {
      setPurchaseError(requestError.message)
    }
  }

  async function handleDelete(vehicle) {
    const confirmed = window.confirm(
      `Delete ${vehicle.make} ${vehicle.model} from the inventory?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingVehicleId(vehicle.id)
    setPurchaseMessage('')
    setPurchaseError('')

    try {
      await deleteVehicle(token, vehicle.id)

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (currentVehicle) => currentVehicle.id !== vehicle.id,
        ),
      )

      setPurchaseMessage(
        `${vehicle.make} ${vehicle.model} deleted successfully.`,
      )
    } catch (requestError) {
      setPurchaseError(requestError.message)
    } finally {
      setDeletingVehicleId(null)
    }
  }

  async function handlePurchase(vehicle) {
    setPurchasingVehicleId(vehicle.id)
    setPurchaseMessage('')
    setPurchaseError('')

    try {
      const updatedVehicle = await purchaseVehicle(token, vehicle.id)

      setVehicles((currentVehicles) =>
        currentVehicles.map((currentVehicle) =>
          currentVehicle.id === vehicle.id
            ? { ...currentVehicle, ...updatedVehicle }
            : currentVehicle,
        ),
      )

      setPurchaseMessage(
        `${vehicle.make} ${vehicle.model} purchased successfully.`,
      )
    } catch (requestError) {
      setPurchaseError(requestError.message)
    } finally {
      setPurchasingVehicleId(null)
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price))
  }

  const categories = [
    ...new Set(vehicles.map((vehicle) => vehicle.category)),
  ]

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchableValues = [
      vehicle.make,
      vehicle.model,
      vehicle.category,
    ]

    const matchesSearch = searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    )

    const matchesCategory =
      selectedCategory === 'all' ||
      vehicle.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-bold">
              Drive<span className="text-cyan-400">Deck</span>
            </p>

            <p className="text-xs text-slate-400">
              Inventory dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            Log out
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-medium text-cyan-400">
              Available vehicles
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Vehicle inventory
            </h1>

            <p className="mt-3 text-slate-400">
              Search the inventory and purchase your next vehicle.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsAddFormOpen(true)}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Add vehicle
            </button>
          )}
        </div>

        {isAdmin && isAddFormOpen && (
          <VehicleForm
            onSubmit={handleAddVehicle}
            onCancel={() => setIsAddFormOpen(false)}
          />
        )}

        {purchaseMessage && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-emerald-300"
          >
            {purchaseMessage}
          </p>
        )}

        {purchaseError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-800 bg-red-950 p-4 text-red-300"
          >
            {purchaseError}
          </p>
        )}

        {isLoading && (
          <p role="status" className="mt-10 text-slate-300">
            Loading vehicles...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-10 rounded-xl border border-red-800 bg-red-950 p-4 text-red-300"
          >
            {error}
          </p>
        )}

        {!isLoading && !error && vehicles.length === 0 && (
          <p className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No vehicles are currently available.
          </p>
        )}

        {!isLoading && !error && vehicles.length > 0 && (
          <>
            <div className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-3">
              <div className="md:col-span-2">
                <label
                  htmlFor="vehicle-search"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Search vehicles
                </label>

                <input
                  id="vehicle-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search make, model or category"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                >
                  <option value="all">All categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category} vehicles
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </p>

            {filteredVehicles.length === 0 ? (
              <p className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No vehicles match your search.
              </p>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg"
                  >
                    <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-600" />

                    <div className="p-6">
                      <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                        {vehicle.category}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        {vehicle.make} {vehicle.model}
                      </h2>

                      <p className="mt-6 text-3xl font-bold">
                        {formatPrice(vehicle.price)}
                      </p>

                      <p
                        className={`mt-3 text-sm ${
                          vehicle.quantity > 0
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {vehicle.quantity > 0
                          ? `${vehicle.quantity} in stock`
                          : 'Out of stock'}
                      </p>

                      {isAdmin && (
                        <button
                          type="button"
                          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                          onClick={() => handleDelete(vehicle)}
                          disabled={deletingVehicleId === vehicle.id}
                          className="mt-6 w-full rounded-xl border border-red-800 px-5 py-3 font-semibold text-red-300 transition hover:border-red-500 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingVehicleId === vehicle.id
                            ? 'Deleting...'
                            : 'Delete vehicle'}
                        </button>
                      )}

                      <button
                        type="button"
                        aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
                        onClick={() => handlePurchase(vehicle)}
                        disabled={
                          vehicle.quantity === 0 ||
                          purchasingVehicleId === vehicle.id
                        }
                        className="mt-3 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                      >
                        {vehicle.quantity === 0
                          ? 'Out of stock'
                          : purchasingVehicleId === vehicle.id
                            ? 'Purchasing...'
                            : 'Purchase'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(() =>
    localStorage.getItem('access_token') ? 'dashboard' : 'welcome',
  )

  function handleLogout() {
    localStorage.removeItem('access_token')
    setCurrentScreen('welcome')
  }

  if (currentScreen === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />
  }

  if (currentScreen === 'login') {
    return (
      <AuthForm
        mode="login"
        onBack={() => setCurrentScreen('welcome')}
        onSwitch={() => setCurrentScreen('register')}
        onAuthenticated={() => setCurrentScreen('dashboard')}
      />
    )
  }

  if (currentScreen === 'register') {
    return (
      <AuthForm
        mode="register"
        onBack={() => setCurrentScreen('welcome')}
        onSwitch={() => setCurrentScreen('login')}
      />
    )
  }

  return (
    <WelcomeScreen
      onSignIn={() => setCurrentScreen('login')}
      onCreateAccount={() => setCurrentScreen('register')}
    />
  )
}

export default App