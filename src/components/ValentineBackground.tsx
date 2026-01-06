import { Heart } from "lucide-react";

export const ValentineBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-valentine-blush/20 via-background to-background" />
      
      {/* Rose petals / soft shapes */}
      <div className="absolute inset-0">
        {/* Top left rose cluster */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-valentine-rose/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-valentine-blush/20 rounded-full blur-2xl" />
        
        {/* Top right rose cluster */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-wine/8 rounded-full blur-3xl" />
        <div className="absolute top-32 right-32 w-40 h-40 bg-valentine-blush/15 rounded-full blur-2xl" />
        
        {/* Bottom decorative roses */}
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-valentine-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-56 h-56 bg-wine/6 rounded-full blur-3xl" />
      </div>
      
      {/* Floating hearts */}
      <div className="absolute inset-0">
        {/* Large decorative hearts */}
        <Heart 
          className="absolute top-[8%] left-[5%] w-8 h-8 text-wine/20 animate-float-slow" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[12%] right-[8%] w-6 h-6 text-valentine-rose/25 animate-float-medium" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[25%] left-[12%] w-4 h-4 text-wine/15 animate-float-fast" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[18%] right-[15%] w-10 h-10 text-valentine-blush/30 animate-float-slow" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[35%] left-[8%] w-5 h-5 text-valentine-rose/20 animate-float-medium" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[40%] right-[5%] w-7 h-7 text-wine/15 animate-float-fast" 
          fill="currentColor"
        />
        
        {/* Mid section hearts */}
        <Heart 
          className="absolute top-[50%] left-[3%] w-6 h-6 text-valentine-blush/20 animate-float-medium" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[55%] right-[10%] w-8 h-8 text-wine/12 animate-float-slow" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[65%] left-[10%] w-4 h-4 text-valentine-rose/15 animate-float-fast" 
          fill="currentColor"
        />
        <Heart 
          className="absolute top-[70%] right-[3%] w-5 h-5 text-valentine-blush/25 animate-float-medium" 
          fill="currentColor"
        />
        
        {/* Bottom section hearts */}
        <Heart 
          className="absolute bottom-[25%] left-[6%] w-7 h-7 text-wine/18 animate-float-slow" 
          fill="currentColor"
        />
        <Heart 
          className="absolute bottom-[15%] right-[7%] w-9 h-9 text-valentine-rose/15 animate-float-medium" 
          fill="currentColor"
        />
        <Heart 
          className="absolute bottom-[8%] left-[15%] w-5 h-5 text-valentine-blush/20 animate-float-fast" 
          fill="currentColor"
        />
        <Heart 
          className="absolute bottom-[5%] right-[12%] w-6 h-6 text-wine/12 animate-float-slow" 
          fill="currentColor"
        />
      </div>
      
      {/* Scattered rose petals (abstract shapes) */}
      <div className="absolute inset-0">
        <div className="absolute top-[15%] left-[20%] w-3 h-5 bg-valentine-rose/15 rounded-full rotate-45 blur-[1px]" />
        <div className="absolute top-[22%] right-[25%] w-4 h-6 bg-wine/10 rounded-full -rotate-30 blur-[1px]" />
        <div className="absolute top-[45%] left-[18%] w-3 h-4 bg-valentine-blush/20 rounded-full rotate-60 blur-[1px]" />
        <div className="absolute top-[60%] right-[22%] w-4 h-5 bg-valentine-rose/12 rounded-full -rotate-45 blur-[1px]" />
        <div className="absolute bottom-[30%] left-[25%] w-3 h-5 bg-wine/8 rounded-full rotate-30 blur-[1px]" />
        <div className="absolute bottom-[20%] right-[18%] w-4 h-6 bg-valentine-blush/15 rounded-full -rotate-60 blur-[1px]" />
      </div>
    </div>
  );
};