import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{backgroundColor: "#1c1c1c"}}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
