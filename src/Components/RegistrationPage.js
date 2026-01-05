import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema.js";
import { AUTH_API_END_POINT } from '../config/constants.js';
import axios from 'axios';

function RegistrationPage() {
  const onRegister = async (data) => {
    console.log("Form Data:", data);

    try {
      const response = await axios.post(
        AUTH_API_END_POINT + "/register",
        data
      );

      console.log(`Registration successful! Welcome, ${response.data.name}`);
    } catch (error) {
      console.log(
        `Registration failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const inputClass = (err?: string) =>
    `border p-2 w-full rounded ${
      err ? "border-red-500" : "border-gray-300"
    }`;

  return (
  
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-4 rounded-lg w-full max-w-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Your Account</h2>
  
  
    	<form onSubmit={handleSubmit(onRegister)} className="max-w-md space-y-4">

      <div>
        <input
          placeholder="Choose Your Username"
          className={inputClass(errors.username?.message)}
          {...register("username")}
        />
        <p className="text-red-500 text-sm">{errors.username?.message}</p>
      </div>

     <div>
        <input
          placeholder="Enter Your Email"
          className={inputClass(errors.email?.message)}
          {...register("email")}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>


      <div>
        <input
          placeholder="Enter full name"
          className={inputClass(errors.fullname?.message)}
          {...register("fullname")}
        />
        <p className="text-red-500 text-sm">{errors.fullname?.message}</p>
      </div>

 

      <div>
        <input
          type="password"
          placeholder="Password"
          className={inputClass(errors.password?.message)}
          {...register("password")}
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className={inputClass(errors.confirmPassword?.message)}
          {...register("confirmPassword")}
        />
        <p className="text-red-500 text-sm">
          {errors.confirmPassword?.message}
        </p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
      </form>
      </div>
    </div>
  );
}

export default RegistrationPage;