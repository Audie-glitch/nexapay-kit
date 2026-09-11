import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CancelPage } from './pages/CancelPage';
import { EmbedPage } from './pages/EmbedPage';
import { HomePage } from './pages/HomePage';
import { PayPage } from './pages/PayPage';
import { SuccessPage } from './pages/SuccessPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/embed" element={<EmbedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
