import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StructuredData from './StructuredData';
import { setRouteSeo } from '../lib/seo';
import Header from './Header';
import Footer from './Footer';
import AppointmentModal from './AppointmentModal';
import CTASection from './CTASection';
import ThemeSwitcher from './ThemeSwitcher';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const { isModalOpen, setIsModalOpen, settings } = useAppContext();
  const location = useLocation();

  // Canonical + Open Graph + Twitter tags follow the route on every navigation;
  // pages (BlogPost) layer per-article overrides on top via setSeo.
  useEffect(() => {
    setRouteSeo(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {/* Site-wide LocalBusiness JSON-LD (address, phone, hours from Site Settings) */}
      <StructuredData type="localBusiness" data={settings} />
      <Header onBookAppointment={() => setIsModalOpen(true)} />
      <main>
        <Outlet />
      </main>
      <CTASection />
      <Footer />
      {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} />}
      <ThemeSwitcher />
    </>
  );
};

export default Layout;
