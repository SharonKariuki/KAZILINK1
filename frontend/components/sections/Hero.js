'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="bg-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between space-y-10 md:space-y-0">
          {/* Text */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Connecting Talent with Opportunity</h1>
            <p className="text-xl mb-8">
              Find your dream job or the perfect candidate with our platform designed for workers and employers.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/auth/register?role=worker"
                className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Find Work
              </Link>
              <Link
                href="app/pages/role-selection?role=employer"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 border border-white transition"
              >
                Hire Talent
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="frontend\public\images\People working together.jpg"  // ✅ No import, just a public path
              alt="People working together"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

