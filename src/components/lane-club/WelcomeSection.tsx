import { Heart } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <div className="text-center space-y-4 py-12 px-4">
      <div className="flex justify-center mb-4">
        <Heart className="w-12 h-12 text-primary fill-primary/20" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">
        Welcome to The Lane Club
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        The heartbeat of PopUp Lane. A space where small brands and shoppers connect, 
        share, and grow together.
      </p>
    </div>
  );
};
