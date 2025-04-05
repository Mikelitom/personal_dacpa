"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/dashboard";
    router.push("/dashboard");
  };

  const handleLoginAdmin = async () => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/admin-dashboard";
    router.push("/admin-dashboard");
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Left side with blue background */}
      <div className="hidden md:flex md:w-2/5 flex-col bg-gradient-to-b from-blue-400 to-blue-500 text-white p-10 relative overflow-hidden">
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <div className="w-full h-24 bg-white rounded-t-full transform translate-y-10"></div>
          <div className="w-full h-32 bg-white rounded-t-full transform translate-y-6"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="font-bold text-2xl mb-16">COMPANY LOGO</div>
          
          <h1 className="text-4xl font-bold mb-4">Welcome to...</h1>
          
          <p className="mb-8 opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore 
            magna aliqua.
          </p>
          
          <div className="mt-auto pt-40">
            <p className="opacity-90">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full md:w-3/5 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Login</h2>
            <p className="text-gray-500 mb-8">
              Welcome! Login to get amazing discounts and offers only for you.
            </p>
          </div>
          
          <form>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-500 mb-2">User Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="username" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-500 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              LOGIN
            </button>
            
            <div className="flex justify-between mt-6 text-sm">
              <div>
                <span className="text-gray-500">New User?</span>{" "}
                <a href="#" className="text-blue-500 hover:underline">Signup</a>
              </div>
              <a href="#" className="text-gray-400 hover:underline">Forgot your password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
