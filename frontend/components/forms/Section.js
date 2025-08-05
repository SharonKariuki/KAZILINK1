'use client';

const Section = ({ title, children, icon }) => {
  return (
    <section className="bg-white/70 rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
      <div className="flex items-center mb-5">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-blue-600">
          <span className="text-lg">{icon}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};
export default Section;