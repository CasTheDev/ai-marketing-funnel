import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* Sidebar goes here */}
      <Sidebar />
      
      {/* Main Page Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;