import { Link } from 'react-router-dom';

function Signup() {
    return (
        <div className="min-h-screen w-full">
            {/* Mobile background - hidden on desktop */}
            <div className="md:hidden min-h-screen w-full fixed bg-left-top bg-no-repeat" 
                style={{ backgroundImage: "url('/src/assets/mobile_bg.svg')" }}>
            </div>

            {/* Desktop background - hidden on mobile */}
            <div className="hidden md:block min-h-screen w-full fixed bg-left-top bg-no-repeat" 
                style={{ backgroundImage: "url('/src/assets/desktop_bg.svg')" }}>
            </div>

            {/* Content wrapper - positioned above backgrounds */}
            <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center md:justify-evenly md:gap-8">
                {/* Logo */}
                <div className="flex justify-center items-center mb-10 md:mb-0">
                    <img src="/src/assets/logo_word.png" alt="logo" className="w-1/2 h-1/2 md:w-full md:h-full" />
                </div>

                {/* Signup modal */}
                <div className="flex flex-col items-center justify-center w-7/8 md:w-145 h-150 md:h-172 p-6 px-10 mx-auto md:mx-0 bg-white rounded-lg shadow-lg">
                    <form className="w-full space-y-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-charcoal-header mb-4">Sign Up</h1>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="Create a password"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm bg-green-button text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <img
                                className="h-5 w-5 mr-2"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google logo"
                            />
                            Sign up with Google
                        </button>

                        <div className="mt-4 text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
