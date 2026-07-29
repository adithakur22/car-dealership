import { useState } from 'react'

function WelcomeScreen({ onSignIn }) {
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

function LoginForm({ onBack }) {
  function handleSubmit(event) {
    event.preventDefault()
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
          Sign in to your account
        </h1>

        <p className="mt-2 text-slate-400">
          Access the dealership inventory dashboard.
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
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  )
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')

  if (currentScreen === 'login') {
    return <LoginForm onBack={() => setCurrentScreen('welcome')} />
  }

  return <WelcomeScreen onSignIn={() => setCurrentScreen('login')} />
}

export default App