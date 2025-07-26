import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
