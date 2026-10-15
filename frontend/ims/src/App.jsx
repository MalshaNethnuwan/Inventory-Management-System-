import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardCard from './components/DashboardCard';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import Categories from './pages/Catergories';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Dashboard/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;