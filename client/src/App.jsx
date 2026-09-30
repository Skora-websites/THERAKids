import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Conditions from './pages/Conditions';
import Gallery from './pages/Gallery';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Programs from './pages/Programs';
import Legal from './pages/Legal';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';

// Remounts ServiceDetail on slug change so its loading state and effects reset
// cleanly when navigating between service pages (e.g. from Related Services).
const ServiceDetailRoute = () => {
  const { slug } = useParams();
  return <ServiceDetail key={slug} />;
};

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
            <Route path="/services/:slug" element={<ServiceDetailRoute />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/contact" element={<Contact />} />
            {/* Legal hub. Old URLs redirect so existing links keep working. */}
            <Route path="/legal" element={<Legal />} />
            <Route path="/privacy-policy" element={<Navigate to="/legal" replace />} />
            <Route path="/terms" element={<Navigate to="/legal" replace />} />
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
