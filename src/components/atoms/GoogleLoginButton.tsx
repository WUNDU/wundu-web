'use client'
import Button from "./Button";

const GoogleLoginButton: React.FC = () => {
  return (
    <Button onClick={() => { }} variant="google">
      <div className="flex items-center justify-center">
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google Icon" className="h-4 w-4 m-1.5" />
        <span>Entrar com o Google</span>
      </div>
    </Button>
  );
};

export default GoogleLoginButton