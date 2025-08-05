import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { messaging } from './firebase';
import Chatbot from './components/Chatbot';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload?.data?.type === 'cooking-complete') {
        toast.info('Cooking complete');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <Chatbot />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
