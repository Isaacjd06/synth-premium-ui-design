import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 mt-16 min-h-[calc(100vh-4rem)] lg:w-[calc(100%-240px)] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
