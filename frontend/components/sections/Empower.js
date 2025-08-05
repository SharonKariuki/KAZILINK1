import { FaShieldAlt, FaUsers, FaBriefcase, FaFileAlt, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import Link from "next/link";

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

const quickLinks = [
  {
    label: "Crafting Your CV",
    icon: <FaFileAlt size={20} />,
    href: "https://www.livecareer.co.uk/lp/lukrsmlp09.aspx?utm_source=google&utm_medium=sem&utm_campaign=15014175303&utm_term=cv%20creator&network=g&device=c&adposition=&adgroupid=131246589480&placement=&adid=554581677834&gad_source=1&gad_campaignid=15014175303&gbraid=0AAAAADnhQlO7VGncPWU-D3vpbpW653Vlw&gclid=EAIaIQobChMIqtSahP2GjgMVaaeDBx36hAGqEAAYASAAEgKCWfD_BwE",
  },
  {
    label: "Salary Insights",
    icon: <FaMoneyBillWave size={20} />,
    href: "https://www.deel.com/salary-insights/",
  },
  {
    label: "Income Estimator",
    icon: <FaCalculator size={20} />,
    href: "https://www.aren.co.ke/calculators/deducalc.htm",
  },
];

const Empower = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">
          Empower Your Future
        </h2>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center justify-center gap-2 bg-blue-700 text-white py-4 rounded-xl hover:bg-blue-800 transition"
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Empower;
