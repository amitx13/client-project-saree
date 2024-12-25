import React from 'react';

interface BackgroundLogoProps {
  children: React.ReactNode;
}

const BackgroundLogo: React.FC<BackgroundLogoProps> = ({ children }) => {
    return (
      <div className="relative ">
        <div
         className="fixed inset-0 top-20 bg-center bg-contain bg-no-repeat opacity-10 md:opacity-5"
         style={{
            backgroundImage: "url('/logoJDLifestyle.jpeg')",
          }}/>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };

export default BackgroundLogo;
