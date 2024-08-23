import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    id: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('client');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordsMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  const emailCheck = () => {
    const email = formData.email;
    return email.length > 6 && email.includes('.');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch()) {
      toast.error('Passwords do not match!');
      return;
    }

    if (emailCheck()) {
      try {
        await axios.post(`http://localhost:8181/api/${selectedOption}/auth/register`, formData);
        navigate('/');
        toast.success('Successfully registered!');
      } catch (error) {
        toast.error('User already exists');
      }
    } else {
      toast.error('Invalid Email');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="client"
              checked={selectedOption === 'client'}
              onChange={() => setSelectedOption('client')}
              className="hidden peer"
            />
            <span
              className={`px-6 py-2 min-w-[120px] text-center border border-violet-600 rounded 
                ${selectedOption === 'client' ? 'text-white bg-violet-600' : 'text-violet-600 hover:bg-violet-600 hover:text-white'} 
                focus:outline-none focus:ring`}
            >
              Rider
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="driver"
              checked={selectedOption === 'driver'}
              onChange={() => setSelectedOption('driver')}
              className="hidden peer"
            />
            <span
              className={`px-6 py-2 min-w-[120px] text-center border border-violet-600 rounded 
                ${selectedOption === 'driver' ? 'text-white bg-violet-600' : 'text-violet-600 hover:bg-violet-600 hover:text-white'} 
                focus:outline-none focus:ring`}
            >
              Driver
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            />
          </div>

          {selectedOption === 'driver' && (
            <>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                />
              </div>

              <div>
                <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">
                  ID
                </label>
                <input
                  id="id"
                  name="id"
                  type="text"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              required
              autoComplete="email"
              className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign Up
            </button>
            <ToastContainer />
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
