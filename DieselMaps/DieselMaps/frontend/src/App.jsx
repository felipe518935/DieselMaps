import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Map from './pages/Map.jsx';
import StationDetail from './pages/StationDetail.jsx';
import CreateStation from './pages/CreateStation.jsx';
import Favorites from './pages/Favorites.jsx';
import RoutesPage from './pages/Routes.jsx';
import Compare from './pages/Compare.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map />} />
          <Route path="/station/:id" element={<StationDetail />} />
          <Route path="/create-station" element={<CreateStation />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
