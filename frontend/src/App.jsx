import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmApp from './pages/FarmApp';

function App() {
  return (
    <div className="app-wrapper">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Unified Real-World App replacing all old fragmented dark-mode routes */}
          <Route path="/dashboard" element={<FarmApp />} />
          <Route path="/upload" element={<FarmApp />} />
          <Route path="/history" element={<FarmApp />} />
          <Route path="/profile" element={<FarmApp />} />
          <Route path="/admin" element={<FarmApp />} />
          <Route path="/app" element={<FarmApp />} />
          <Route path="*" element={<FarmApp />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
