import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";

const Form = ({ onSubmit, error }) => {
  return (
    <div className="bg-white font-sans text-gray-900 antialiased h-screen overflow-hidden">
      <div className="flex min-h-screen">
        {/* Hero Section - Left Side (Desktop Only) */}
        <LoginHero />

        {/* Form Section - Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto">
          <LoginForm onSubmit={onSubmit} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Form;
