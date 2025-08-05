

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Kazilink</h2>
          <p className="text-sm text-gray-400">
            Connecting talent with opportunity for a better working world.
          </p>
        </div>

        {/* For Workers */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For Workers</h3>
          <ul className="text-sm space-y-2 text-gray-400">
            <li>✔️ Create your profile and showcase your skills</li>
            <li>✔️ Apply for jobs that match your expertise</li>
            <li>✔️ Connect with reliable employers</li>
          </ul>
        </div>

        {/* For Employers */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For Employers</h3>
          <ul className="text-sm space-y-2 text-gray-400">
            <li>✔️ Post job opportunities for free</li>
            <li>✔️ Browse skilled worker profiles</li>
            <li>✔️ Hire trusted talent from your community</li>
          </ul>
        </div>

        {/* Company & Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="text-sm space-y-2 text-gray-400">
            <li>
              <Link href="/pages/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/pages/contact" className="hover:text-indigo-400 transition-colors">Contact</Link>
            </li>
            <li>
              <Link href="/pages/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@kazilink.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>

            <div className="flex gap-4 mt-4">
              <SocialLink href="https://facebook.com" icon={<Facebook />} />
              <SocialLink href="https://instagram.com" icon={<Instagram />} />
              <SocialLink href="https://twitter.com" icon={<Twitter />} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Kazilink. All rights reserved.
      </div>
    </footer>
  );
}

// Helper component for social icons
function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-indigo-400 transition-colors"
    >
      {icon}
    </a>
  );
}
