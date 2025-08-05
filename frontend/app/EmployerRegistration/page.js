'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { jwtDecode } from 'jwt-decode';

import {
  BaseFormLayout,
  Section,
  FormInput,
  FileUpload,
  RadioButton,
  Checkbox
} from '@/components/forms';
import { useRegistrationForm } from '@/hooks/useEmployerRegistrationForm';

export default function EmployerRegistrationPage() {
  const router = useRouter();

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleFileChange,
    validate,
    setFormData,
    setErrors,
    setIsSubmitting
  } = useRegistrationForm({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    latitude: '',
    longitude: '',
    idFront: null,
    idBack: null,
    selfiePath: null,
    hasCriminalRecord: 'no',
    explanation: '',
    confirmInfo: false,
    consent: false
  });

  const [hoveredUpload, setHoveredUpload] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setFormData((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, [setFormData]);

  const renderFilePreview = (file, isImage = false) => {
    if (!file) return null;
    return (
      <div className="mt-2">
        {isImage && file.type?.startsWith('image') ? (
          <img
            src={URL.createObjectURL(file)}
            alt="File Preview"
            className="w-32 h-20 object-cover rounded border"
          />
        ) : (
          <p className="text-sm text-green-600">Uploaded: {file.name}</p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      console.log("Validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');
      if (!token) throw new Error('User not found. Please verify your email.');

      const decoded = jwtDecode(token);
      const userId = decoded?.id;
      if (!userId) throw new Error('Invalid token. Please try again.');

      const data = new FormData();

      // Append all fields, handling files separately
      for (const key in formData) {
        const value = formData[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          !(typeof value === 'boolean' && value === false)
        ) {
          if (key === 'idFront' && value instanceof File) {
            data.append('idFront', value);
          } else if (key === 'idBack' && value instanceof File) {
            data.append('idBack', value);
          } else if (key === 'selfiePath' && value instanceof File) {
            data.append('selfie', value); // ✅ correct backend field name
          } else {
            data.append(key, value);
          }
        }
      }

      data.append('role', 'employer');

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employers/register?userId=${userId}`;
      console.log("➡️ Employer Registration API URL:", apiUrl);

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: data
      });

      let result;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error("Server returned unexpected content. Check your API URL or backend.");
      }

      if (!res.ok) {
        console.error('server error details', {
          status: res.status,
          statusText: res.statusText,
          errorBody: result
        });
        throw new Error(result.message || 'Registration failed');
      }

      alert('🎉 Employer registered successfully!');
      router.push('/signin');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-24">
      <BaseFormLayout
        title="Register as an Employer"
        description="Create your profile to start hiring top talent"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {/* Personal Info */}
        <Section title="Personal Information" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name*"
              error={errors.firstName}
              icon="user"
            />
            <FormInput
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name*"
              error={errors.lastName}
              icon="user"
            />
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address*"
              error={errors.email}
              icon="email"
            />
            <div className="space-y-1">
              <PhoneInput
                country="ke"
                value={formData.phone}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, phone }))
                }
                placeholder="Phone Number*"
                inputClass="!w-full !h-11 !pl-14 !rounded-lg !border-gray-300 !focus:ring-2 !focus:ring-blue-500 !focus:border-transparent !text-black"
                dropdownClass="!rounded-lg !border !border-gray-200 !shadow-lg"
                buttonClass="!rounded-l-lg !bg-gray-100 !border-r !border-gray-300"
                containerClass={`!w-full ${errors.phone ? '!border-red-500 !rounded-lg' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <FormInput
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Date of Birth*"
              error={errors.dob}
            />
            <div className="space-y-1">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${formData.gender ? 'text-black' : 'text-gray-300'}`}
              >
                <option value="" disabled hidden>
                  Gender*
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Address Info */}
        <Section title="Address Information" icon="📍">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street Address*"
              error={errors.street}
              icon="location"
            />
            <FormInput
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City*"
              error={errors.city}
              icon="city"
            />
            <FormInput
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State/Province*"
              error={errors.state}
              icon="flag"
            />
            <FormInput
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="ZIP / Postal Code*"
              error={errors.zip}
              icon="map"
            />
            <FormInput
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country*"
              error={errors.country}
              icon="globe"
            />
          </div>
        </Section>

        {/* ID Verification */}
        <Section title="ID Verification" icon="🪪">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Front Side of ID*"
              side="idFront"
              onChange={(e) => handleFileChange(e, 'idFront')}
              isHovered={hoveredUpload === 'idFront'}
              onMouseEnter={() => setHoveredUpload('idFront')}
              onMouseLeave={() => setHoveredUpload(null)}
              error={errors.idFront}
            />
            {renderFilePreview(formData.idFront, true)}

            <FileUpload
              label="Back Side of ID*"
              side="idBack"
              onChange={(e) => handleFileChange(e, 'idBack')}
              isHovered={hoveredUpload === 'idBack'}
              onMouseEnter={() => setHoveredUpload('idBack')}
              onMouseLeave={() => setHoveredUpload(null)}
              error={errors.idBack}
            />
            {renderFilePreview(formData.idBack, true)}

            <FileUpload
              label="Selfie with ID*"
              side="selfiePath"
              onChange={(e) => handleFileChange(e, 'selfiePath')}
              isHovered={hoveredUpload === 'selfiePath'}
              onMouseEnter={() => setHoveredUpload('selfiePath')}
              onMouseLeave={() => setHoveredUpload(null)}
              error={errors.selfiePath}
            />
            {renderFilePreview(formData.selfiePath, true)}
          </div>
        </Section>

        {/* Background Check */}
        <Section title="Background Declaration" icon="🔍">
          <label className="block text-gray-700 font-medium">
            Do you have any criminal record?*
          </label>
          <div className="flex flex-wrap gap-6 mt-2">
            <RadioButton
              name="hasCriminalRecord"
              value="no"
              label="No"
              checked={formData.hasCriminalRecord === 'no'}
              onChange={() => setFormData({ ...formData, hasCriminalRecord: 'no' })}
            />
            <RadioButton
              name="hasCriminalRecord"
              value="yes"
              label="Yes"
              checked={formData.hasCriminalRecord === 'yes'}
              onChange={() => setFormData({ ...formData, hasCriminalRecord: 'yes' })}
            />
          </div>
          {formData.hasCriminalRecord === 'yes' && (
            <div className="mt-4 space-y-1">
              <label className="block text-gray-700 font-medium">
                Please provide details of the offence*
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Minor traffic offence in 2020"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {errors.explanation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.explanation}
                </p>
              )}
            </div>
          )}
        </Section>

        {/* Consent */}
        <Section title="Terms & Conditions" icon="📝">
          <div className="space-y-4">
            <Checkbox
              name="confirmInfo"
              checked={formData.confirmInfo}
              onChange={handleChange}
              label="I certify that all information provided is accurate and complete."
              error={errors.confirmInfo}
            />
            <Checkbox
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              label="I agree to the collection and processing of my personal data for verification and background checks."
              error={errors.consent}
            />
          </div>
        </Section>
      </BaseFormLayout>
    </div>
  );
}
