import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
      <main className="">
        <Outlet /> {/* This renders the nested routes */}
      </main>
  );
}

export default Layout;
