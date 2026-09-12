import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerMenu from './components/CustomerMenu';
import AdminPanel from './components/AdminPanel';
import KitchenPanel from './components/KitchenPanel';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerMenu />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/kitchen" element={<KitchenPanel />} />
      </Routes>
    </Router>
  );
}
