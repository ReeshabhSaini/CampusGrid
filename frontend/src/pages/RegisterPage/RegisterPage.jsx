import React from "react";
import { assets } from "../../assets/assets";

const RegisterPage = () => {
  return (
    <div class="min-h-screen flex items-center">
      <div class="w-full max-w-3xl">
        <div class="md:w-1/2 md:pr-8 ml-20">
          <h1 class="text-3xl font-bold text-gray-800 mb-10">
            Create a New Account
          </h1>
          <form class="space-y-4">
            <div>
              <label for="email" class="block text-gray-700 font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="username@pec.edu.in"
                class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
              />
            </div>
            <p class="text-xs text-gray-600">
              By creating an account, you agree to our&nbsp;
              <a href="#" class="text-indigo-600 underline">
                Terms of use
              </a>{" "}
              and&nbsp;
              <a href="#" class="text-indigo-600 underline">
                Privacy Policy
              </a>
            </p>
            <button
              type="submit"
              class="w-full py-2 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 font-bold"
            >
              Send OTP
            </button>
            <div class="text-center text-gray-600 font-medium">
              or continue with
            </div>
            <button
              type="button"
              class="flex items-center justify-center w-full py-2 px-4 border rounded-lg text-gray-700 bg-white hover:bg-gray-100 shadow-sm"
            >
              Sign in with Google
            </button>
          </form>
          <p class="text-sm text-center text-gray-600 mt-4">
            Already have an account?
            <a href="/" class="text-indigo-600 underline">
              Log in
            </a>
          </p>
        </div>
        <div class="absolute top-0 right-0 w-1/2 h-full bg-contain bg-no-repeat bg-right">
          <img src={assets.StartImage} alt="Campus Grid Start Up image" />
        </div>
        <div class="absolute bottom-20 right-20 w-40 h-40 mr-10">
          <img src={assets.Logo} alt="Campus Grid Logo" className="ml-10" />
          <p className="font-sans mt-3 text-4xl font-extrabold ">
            <span className="text-green-700">Campus</span>
            &nbsp;
            <span className="text-gray-600">Grid</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
