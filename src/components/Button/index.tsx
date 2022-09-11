import { ReactNode } from "react";

export const Button = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      className={`bg-black text-white py-2 px-8 rounded-full text-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
