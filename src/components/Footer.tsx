import type { ProfileData } from '@/services/api';

interface FooterProps {
  profile: ProfileData;
}

export const Footer = ({ profile }: FooterProps) => {
  return (
    <footer className="relative py-8 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center text-gray-400">
        <p>© 2025 {profile.user.first_name} {profile.user.last_name}. Designed with intention, protected by law.</p>
      </div>
    </footer>
  );
};

