import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
