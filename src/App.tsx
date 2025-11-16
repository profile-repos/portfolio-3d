import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProfile } from './hooks/use-profile';
import { useMousePosition } from './hooks/use-mouse-position';
import { useBlogs } from './hooks/use-blogs';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { LoadingProvider } from './contexts/LoadingContext';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Blog } from './components/Blog';
import { LetsWorkTogether } from './components/LetsWorkTogether';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

const Portfolio3D = () => {
  const { data: profile, isLoading, error } = useProfile();
  const mousePosition = useMousePosition();
  const { blogs, blogsLoading } = useBlogs();

  return (
    <>
      <AnimatedBackground />
      <div className="bg-gray-900 text-white">
        <LoadingScreen isLoading={isLoading} error={error} />
        
        {profile && (
          <>
            <Hero profile={profile} mousePosition={mousePosition} />
            <Skills profile={profile} mousePosition={mousePosition} />
            <Projects profile={profile} />
            <Experience profile={profile} />
            {!blogsLoading && blogs.length > 0 && (
              <Blog blogs={blogs} mousePosition={mousePosition} />
            )}
            <LetsWorkTogether />
            <Contact profile={profile} />
            <Footer profile={profile} />
          </>
        )}
      </div>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Portfolio3D />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </QueryClientProvider>
  );
};

export default App;
