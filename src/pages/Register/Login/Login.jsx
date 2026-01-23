import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";

const Form = ({ onSubmit, error }) => {
  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      {/* Left Side - Hero Section (Fixed) */}
      <LoginHero />

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col h-screen">
        {/* Mobile Logo - Fixed */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-8 pb-4 flex-shrink-0">
          <span className="material-icons-round text-brand-blue text-3xl">school</span>
          <span className="font-bold text-xl text-brand-navy font-roboto">EntranceGateway</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
          <LoginForm onSubmit={onSubmit} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Form;
