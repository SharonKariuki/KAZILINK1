import Layout from '../../components/Layouts/Layout';


export default function About() {
  return (
    <Layout title="About Us">
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">About Kazilink</h1>
          <p className="text-gray-700 text-lg mb-4">
            Kazilink is a platform dedicated to connecting informal workers with real job opportunities. We believe in
            empowering individuals through accessible technology that bridges the gap between talent and employment.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Our mission is to make employment more transparent, accessible, and fair for everyone—especially for those
            who are often left behind in the traditional job market. Whether you're a plumber, carpenter, house help,
            tailor, or digital freelancer, Kazilink gives you visibility and access to employers looking for your skills.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            For employers, we provide a trusted network of verified workers you can count on. You can view profiles,
            read reviews, and hire based on qualifications and reliability.
          </p>
          <p className="text-gray-700 text-lg">
            Together, we're building a future where no skill goes unnoticed and every worker has a chance to thrive.
          </p>
        </div>
      </div>
    </Layout>
  );
}
