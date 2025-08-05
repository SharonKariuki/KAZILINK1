'use client';
import React,{useState,useEffect} from 'react';
// import React, { useState, useEffect } from 'react';
import ArticlesSection from '../components/sections/ArticlesSection';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { FaUserTie, FaUsers, FaFileAlt, FaMoneyBillWave, FaCalculator, FaRocket, FaChartLine, FaHandshake, FaLightbulb } from "react-icons/fa";

export default function Home() {
  const[activeJobs, setActiveJobs] = useState(null);
  const[totalUsers, setTotalUsers] = useState(null);
   useEffect(() => {
    fetch('/api/stats/jobs/active')
      .then(res => res.json())
      .then(data => setActiveJobs(data.count))
      .catch(console.error);

    fetch('/api/stats/users/active')
      .then(res => res.json())
      .then(data => setTotalUsers(data.count))
      .catch(console.error);
  }, []);
  const benefits = [
    {
      title: "For Job Seekers",
      icon: <FaUserTie className="text-indigo-400" size={28} />,
      items: [
        "Access thousands of vetted job opportunities",
        "Create a professional profile in minutes",
        "Get matched with relevant jobs using inn seconds",
        "Receive real-time application updates"
      ]
    },
    {
      title: "For Employers",
      icon: <FaUsers className="text-purple-400" size={28} />,
      items: [
        "Post jobs in under 2 minutes",
        "Access pre-qualified candidates",
        "Automatic candidate matching",
        "Comprehensive hiring analytics"
      ]
    }
  ];

  

  const quickLinks = [
    {
      label: "Crafting Your CV",
      icon: <FaFileAlt />,
      href: "https://resumewise.com/?gad_source=1&gad_campaignid=22717566875&gbraid=0AAAAADw4kP0mocGWh2QRpQVszPe9MNASo&gclid=CjwKCAjwsZPDBhBWEiwADuO6y7i7jvcwBNqfQZH0b0x0-vj2TCdMg3US0CTiqqp4RXSoXKtV6MYSgxoCttYQAvD_BwE",
      description: "Create a standout resume with our expert guide"
    },
    {
      label: "Salary Insights",
      icon: <FaMoneyBillWave />,
      href: "https://www.deel.com/salary-insights/",
      description: "Compare salaries and negotiate better offers"
    },
    {
      label: "Career Calculator",
      icon: <FaCalculator />,
      href: "https://workforcedevelopment.ca/career-calculator/",
      description: "Plan your career path and growth potential"
    }
  ];

  const features = [
    {
      icon: <FaRocket className="text-blue-400 text-2xl" />,
      title: "Fast Matching",
      description: "Our platform connects you with ideal opportunities in seconds"
    },
    {
      icon: <FaChartLine className="text-indigo-400 text-2xl" />,
      title: "Growth Tools",
      description: "Access resources to advance your career or business"
    },
    {
      icon: <FaHandshake className="text-purple-400 text-2xl" />,
      title: "Trusted Network",
      description: "Join a community of verified professionals"
    },
    {
      icon: <FaLightbulb className="text-violet-500 text-2xl" />,
      title: "Smart Insights",
      description: "Get data-driven advice for better decisions"
    }
  ];

  return (
    <>
      {/* Hero Section */}
     <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-800/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-800/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:w-1/2"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Elevate Your <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">Career</span> or <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Business</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light max-w-lg">
                The premier platform connecting exceptional talent with visionary companies through intelligent matching.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* Worker Signup Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/signup?role=worker" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2">
                    Find Your Dream Job
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 ..."/></svg>
                  </Link>
                </motion.div>
                {/* Employer Signup Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/signup?role=employer" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2">
                    Hire Top Talent
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor"><path d="M13 6a3 ..."/></svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 transform perspective-1000 group-hover:rotate-y-3 transition-transform duration-700">
                <Image
                  src="/images/business-people-working-together.jpg"
                  alt="Diverse team collaborating in modern office"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <motion.p className="text-white/90 italic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    "This platform helped us find the perfect candidate in just 3 days!" — Sarah, HR Director
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ➖ Add banners right below hero */}
          {/* {banners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              {banners.map((banner) => (
                <motion.div key={banner._id} whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md">
                  <Link href={banner.link || '#'} className="block">
                    <img src={banner.imageUrl} alt={banner.title} className="rounded-md object-cover w-full h-40" />
                    <h3 className="text-white mt-3 text-lg font-semibold">{banner.title}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )} */}
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 bg-white rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-md"
            >
              <p className="text-4xl font-bold text-indigo-900 mb-2 font-serif">
                {activeJobs !== null ? activeJobs : '...'}
              </p>
              <p className="text-blue-700 font-medium">Active Jobs</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 bg-white rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-md"
            >
              <p className="text-4xl font-bold text-indigo-900 mb-2 font-serif">
                {totalUsers !== null ? totalUsers : '...'}
              </p>
              <p className="text-blue-700 font-medium">Active Users</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 font-serif tracking-tight">
              Designed For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Exceptional</span> Results
            </h2>
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto font-light">
              Whether you're looking for your next opportunity or your next star employee, we've crafted the perfect solution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                viewport={{ once: true }}
                className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-md border transition-all duration-500 hover:-translate-y-2 ${
                  index === 0 
                    ? "border-blue-100 hover:border-blue-200" 
                    : "border-indigo-100 hover:border-indigo-200"
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-lg backdrop-blur-sm ${
                    index === 0 
                      ? "bg-blue-100/50 text-blue-500" 
                      : "bg-indigo-100/50 text-indigo-500"
                  }`}>
                    {benefit.icon}
                  </div>
                  <h3 className={`text-2xl font-semibold font-serif ${
                    index === 0 ? "text-blue-900" : "text-indigo-900"
                  }`}>
                    {benefit.title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {benefit.items.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start text-blue-800/90 group"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 + index * 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <span className={`mr-3 mt-1 group-hover:scale-125 transition-transform ${
                        index === 0 ? "text-blue-500" : "text-indigo-500"
                      }`}>•</span>
                      <span className={`group-hover:${
                        index === 0 ? "text-blue-700" : "text-indigo-700"
                      } transition-colors font-light`}>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 font-serif tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Differentiators</span>
            </h2>
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto font-light">
              Cutting-edge features that make career advancement and talent acquisition effortless.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                viewport={{ once: true }}
                className={`bg-white p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-500 group overflow-hidden relative ${
                  index === 0 ? "hover:border-blue-200 border-blue-100" :
                  index === 1 ? "hover:border-indigo-200 border-indigo-100" :
                  index === 2 ? "hover:border-purple-200 border-purple-100" :
                  "hover:border-violet-200 border-violet-100"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-white ${
                  index === 0 ? "to-blue-50" :
                  index === 1 ? "to-indigo-50" :
                  index === 2 ? "to-purple-50" :
                  "to-violet-50"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                <div className={`p-3 rounded-lg w-max mb-6 ${
                  index === 0 ? "bg-blue-100/50 group-hover:bg-blue-100" :
                  index === 1 ? "bg-indigo-100/50 group-hover:bg-indigo-100" :
                  index === 2 ? "bg-purple-100/50 group-hover:bg-purple-100" :
                  "bg-violet-100/50 group-hover:bg-violet-100"
                } transition-colors`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 font-serif ${
                  index === 0 ? "text-blue-900 group-hover:text-blue-800" :
                  index === 1 ? "text-indigo-900 group-hover:text-indigo-800" :
                  index === 2 ? "text-purple-900 group-hover:text-purple-800" :
                  "text-violet-900 group-hover:text-violet-800"
                } transition-colors`}>{feature.title}</h3>
                <p className="text-blue-800/80 font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="empower" className="py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 font-serif tracking-tight">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Resources</span>
            </h2>
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto font-light">
              Expertly curated tools and guides to elevate your professional journey.
            </p>
          </motion.div>

          <ArticlesSection />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                viewport={{ once: true }}
              >
                <Link
                  href={link.href}
                  className={`flex flex-col h-full p-8 rounded-xl shadow-sm hover:shadow-md border transition-all duration-500 group overflow-hidden relative ${
                    index === 0 ? "border-blue-100 hover:border-blue-200" :
                    index === 1 ? "border-indigo-100 hover:border-indigo-200" :
                    "border-purple-100 hover:border-purple-200"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-white ${
                    index === 0 ? "to-blue-50" :
                    index === 1 ? "to-indigo-50" :
                    "to-purple-50"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${
                      index === 0 ? "bg-blue-100/50 text-blue-600 group-hover:bg-blue-100" :
                      index === 1 ? "bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100" :
                      "bg-purple-100/50 text-purple-600 group-hover:bg-purple-100"
                    } transition-colors`}>
                      {link.icon}
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      index === 0 ? "text-blue-900 group-hover:text-blue-800" :
                      index === 1 ? "text-indigo-900 group-hover:text-indigo-800" :
                      "text-purple-900 group-hover:text-purple-800"
                    } transition-colors`}>
                      {link.label}
                    </h3>
                  </div>
                  <p className="text-blue-800/80 mt-auto font-light">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-800/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-800/20 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif tracking-tight">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-light">
              Join thousands who've transformed their careers and businesses with our platform.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/signup?role=worker"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
                >
                  Get Started Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/signup?role=employer"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
                >
                  Find Talent
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}