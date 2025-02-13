import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen w-full">
      {/* Mobile background - hidden on desktop */}
      <div
        className="fixed min-h-screen w-full bg-left-top bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/src/assets/mobile_bg.svg')" }}
      ></div>

      {/* Desktop background - hidden on mobile */}
      <div
        className="fixed hidden min-h-screen w-full bg-left-top bg-no-repeat md:block"
        style={{ backgroundImage: "url('/src/assets/desktop_bg.svg')" }}
      ></div>

      {/* Content wrapper - positioned above backgrounds */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center md:flex-row md:justify-evenly md:gap-8">
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center md:mb-0">
          <img
            src="/src/assets/logo_word.png"
            alt="logo"
            className="h-1/2 w-1/2 md:h-full md:w-full"
          />
        </div>

        {/* Login modal */}
        <div className="mx-auto flex h-115 w-7/8 flex-col items-center justify-center rounded-lg bg-white p-6 px-10 shadow-lg md:mx-0 md:h-172 md:w-145">
          <form className="w-full space-y-8">
            <div>
              <h1 className="text-charcoal-header mb-4 text-2xl font-bold md:text-3xl">
                Login
              </h1>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="bg-green-button w-full rounded-md border border-transparent px-4 py-2 text-white shadow-sm hover:bg-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <img
                className="mr-2 h-5 w-5"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              Sign in with Google
            </button>

            <div className="mt-4 text-center">
              <span className="text-gray-600">
                Don&apos;t have an account yet?{' '}
              </span>
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
