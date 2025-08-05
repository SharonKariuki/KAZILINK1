// components/sections/ArticlesSection.js
import { FaShieldAlt, FaUsers, FaBriefcase } from "react-icons/fa";

const ArticlesSection = () => {
  const articles = [
    {
      title: "Your Trusted Platform",
      author: "Alex J.",
      readTime: "4 min. read",
      icon: <FaShieldAlt size={32} />,
    },
    {
      title: "Boost Team Productivity",
      author: "Maria K.",
      readTime: "7 min. read",
      icon: <FaUsers size={32} />,
    },
    {
      title: "Navigating Job Markets",
      author: "Chris L.",
      readTime: "2 min. read",
      icon: <FaBriefcase size={32} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {articles.map((item, index) => (
        <div
          key={index}
          className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-center mb-4 text-blue-700">
            {item.icon}
          </div>
          <h3 className="text-xl font-semibold text-center text-blue-900 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-center text-blue-600">
            {item.author}, {item.readTime}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ArticlesSection;