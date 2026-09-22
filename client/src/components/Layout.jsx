import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AppointmentModal from './AppointmentModal';
import CTASection from './CTASection';
import ThemeSwitcher from './ThemeSwitcher';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const { isModalOpen, setIsModalOpen } = useAppContext();

  return (
    <>
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
