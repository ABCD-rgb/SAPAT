import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated
    fetch('http://localhost:3000/api/user', {
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          navigate('/dashboard')
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err)
      })
  }, [navigate])

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'
  }

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
        <div className="mx-auto flex h-auto w-7/8 flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg md:mx-0 md:w-96">
          <h1 className="text-charcoal-header mb-6 text-2xl font-bold md:text-3xl">
            Welcome to SAPAT
          </h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Sign in or sign up with your Google account to continue
          </p>

          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <img
              className="mr-2 h-5 w-5"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
