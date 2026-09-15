import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Conditions from './pages/Conditions';
import Gallery from './pages/Gallery';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Pages */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
