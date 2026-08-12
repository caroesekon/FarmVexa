import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import Chatbot from './Chatbot';

export default function PublicLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <CookieConsent />
            <Chatbot />
        </>
    );
}