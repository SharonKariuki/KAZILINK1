import { FaUserTie, FaUsers } from "react-icons/fa";

const benefits = [
  {
    title: "For Workers",
    icon: <FaUserTie size={28} />,
    items: [
      "Access thousands of job opportunities",
      "Create a professional profile",
      "Get matched with relevant jobs",
      "Receive application updates"
    ]
  },
  {
    title: "For Employers",
    icon: <FaUsers size={28} />,
    items: [
      "Post jobs in minutes",
      "Access qualified candidates",
      "Manage applications easily",
      "Track hiring progress"
    ]
  }
];

const Benefits = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Why Choose Our Platform
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 mb-4 text-blue-700">
                {benefit.icon}
                <h3 className="text-xl font-semibold text-blue-800">
                  {benefit.title}
                </h3>
              </div>
              <ul className="space-y-3 mt-4">
                {benefit.items.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

