// pages/privacy.js
import Layout from '../../components/Layouts/Layout';
export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy">
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">Privacy Policy</h1>

          <p className="text-gray-700 mb-4">
            Kazilink is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
            and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We may collect personal information such as your name, email address, phone number, location,
            and any other details you provide when registering or applying for jobs.
          </p>

          <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 text-gray-700 mb-4 space-y-2">
            <li>To connect workers and employers effectively</li>
            <li>To send updates about job opportunities or platform features</li>
            <li>To improve our services and user experience</li>
          </ul>

          <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">Sharing Your Data</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your data. Your information is only shared with third parties when necessary to provide
            our services (e.g., with employers viewing your public profile, or with service providers assisting us).
          </p>

          <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You may request to view, update, or delete your personal data at any time by contacting us.
          </p>

          <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-2">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us at
            <strong> support@kazilink.com</strong>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
