import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Map from './pages/Map';
import StationDetail from './pages/StationDetail';
import CreateStation from './pages/CreateStation';
import RoutesPage from './pages/Routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map />} />
          <Route path="/station/:id" element={<StationDetail />} />
          <Route path="/create-station" element={<CreateStation />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/" element={<Navigate to="/map" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
