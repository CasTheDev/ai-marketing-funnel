import Sidebar from "./Sidebar";
import Footer from "./Footer";

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

      </div>
    </div>
  );
}

export default DashboardLayout;