'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  BaseFormLayout,
  Section,
  FormInput,
  FileUpload,
  RadioButton,
  Checkbox
} from '@/components/forms';
import { useRegistrationForm } from '@/hooks/useWorkerRegistrationForm';

function LocationAutocomplete({ setFormData }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setValue(query);
    if (query.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleSelect = (place) => {
    setValue(place.display_name);
    setSuggestions([]);
    setFormData((prev) => ({
      ...prev,
      street: place.display_name,
      city: place.address?.city || '',
      state: place.address?.state || '',
      country: place.address?.country || '',
      latitude: place.lat,
      longitude: place.lon,
    }));
  };

  return (
    <Section title="Address Information" icon="📍">
      <div className="mb-4">
        <input
          value={value}
          onChange={handleInputChange}
          placeholder="Start typing your address..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border mt-2 rounded shadow text-black max-h-60 overflow-y-auto">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleSelect(place)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

export default function WorkerRegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [hasCert, setHasCert] = useState(false);
  const [criminalRecord, setCriminalRecord] = useState('No');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [hoveredUpload, setHoveredUpload] = useState(null);

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
    occupation: '',
    experience: '',
    education: '',
    degree: '',
    field: '',
    completionYear: '',
    certificationName: '',
    issuingOrg: '',
    certificationDate: '',
    explanation: '',
    confirmInfo: false,
    consent: false,
    idFront: null,
    idBack: null,
    selfie: null,
    cv: null,
    certificate: null,
  });

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const renderFilePreview = (file, isImage = false) => {
    if (!file) return null;
    return (
      <div className="mt-2">
        {isImage && file.type?.startsWith('image') ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
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
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');
      if (!token) throw new Error('User not found. Please verify your email.');

      const decoded = jwtDecode(token);
      const userId = decoded?.id;
      if (!userId) throw new Error('Invalid token. Please try again.');

      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }
      data.append('skills', JSON.stringify(skills));
      data.append('role', 'worker');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workers/register?userId=${userId}`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        console.error('server error details', {
          status: res.status,
          statusText: res.statusText,
          errorBody: result,
        });
        throw new Error(result.msg || 'Registration failed');
      }
      alert('🎉 Worker registered successfully!');
      router.push('/signin');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseFormLayout
      title="Worker Registration"
      description="Join our network of skilled professionals"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      {/* Personal Info Section */}
      <Section title="Personal Information" icon="👤">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <PhoneInput
              country={'ke'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              placeholder="Phone Number*"
              inputClass="!w-full !h-11 !pl-14 !rounded-lg !border-gray-300 !focus:ring-2 !focus:ring-blue-500 !focus:border-transparent !text-black"
              dropdownClass="!rounded-lg !border !border-gray-200 !shadow-lg"
              buttonClass="!rounded-l-lg !bg-gray-100 !border-r !border-gray-300"
              containerClass={`!w-full ${errors.phone ? '!border-red-500 !rounded-lg' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
              ${formData.dob ? 'text-black' : 'text-gray-400'} appearance-none`}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
              ${formData.gender ? 'text-black' : 'text-gray-300'}`}
          >
            <option value="" disabled hidden>Gender*</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Section>

      {/* Address Info Section */}
     
<Section title="Address Information" icon="📍">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormInput
      name="street"
      value={formData.street}
      onChange={handleChange}
      placeholder="Street Address"
      icon="location"
      error={errors.street}
    />
    <FormInput
      name="city"
      value={formData.city}
      onChange={handleChange}
      placeholder="City*"
      icon="city"
      error={errors.city}
    />
    <FormInput
      name="state"
      value={formData.state}
      onChange={handleChange}
      placeholder="State / Province"
      icon="flag"
      error={errors.state}
    />
    <FormInput
      name="zip"
      value={formData.zip}
      onChange={handleChange}
      placeholder="ZIP / Postal Code"
      icon="map"
      error={errors.zip}
    />
    <FormInput
      name="country"
      value={formData.country}
      onChange={handleChange}
      placeholder="Country*"
      icon="globe"
      error={errors.country}
    />
  </div>
</Section>


      {/* Work Info Section */}
      <Section title="Work Information" icon="💼">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Primary Occupation*"
            error={errors.occupation}
            icon="briefcase"
          />
          <FormInput
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of Experience*"
            error={errors.experience}
            icon="calendar"
          />
        </div>
      </Section>

      {/* Skills Section */}
      <Section title="Skills" icon="🛠️">
        <div className="flex gap-4 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Enter a skill"
            className="flex-1 px-4 py-2.5 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center"
            >
              {skill}
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeSkill(skill)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
      </Section>

      {/* Education Section */}
      <Section title="Education" icon="🎓">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="Institution Name"
            icon="school"
          />
          <FormInput
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree or Certificate"
            icon="certificate"
          />
          <FormInput
            name="field"
            value={formData.field}
            onChange={handleChange}
            placeholder="Field of Study"
            icon="book"
          />
          <input
            type="month"
            name="completionYear"
            value={formData.completionYear}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
          />
        </div>
      </Section>

      {/* Certifications Section */}
      <Section title="Certifications" icon="📜">
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Do you have any professional certifications?
          </label>
          <div className="flex gap-6">
            <RadioButton
              name="hasCert"
              value="yes"
              label="Yes"
              checked={hasCert}
              onChange={() => setHasCert(true)}
            />
            <RadioButton
              name="hasCert"
              value="no"
              label="No"
              checked={!hasCert}
              onChange={() => setHasCert(false)}
            />
          </div>
        </div>
        {hasCert && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="certificationName"
              value={formData.certificationName}
              onChange={handleChange}
              placeholder="Certification Name"
              icon="badge"
            />
            <FormInput
              name="issuingOrg"
              value={formData.issuingOrg}
              onChange={handleChange}
              placeholder="Issuing Organization"
              icon="organization"
            />
            <input
              type="month"
              name="certificationDate"
              value={formData.certificationDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
            />
            <FileUpload
              label="Upload Certificate"
              side="certificate"
              onChange={(e) => handleFileChange(e, 'certificate')}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {renderFilePreview(formData.certificate)}
          </div>
        )}
      </Section>

      {/* Upload CV Section */}
      <Section title="Upload CV" icon="📄">
        <FileUpload
          label="CV/Resume (PDF, DOC, DOCX)"
          side="cv"
          onChange={(e) => handleFileChange(e, 'cv')}
          accept=".pdf,.doc,.docx"
        />
        {renderFilePreview(formData.cv)}
      </Section>

      {/* ID Verification Section */}
      <Section title="ID Verification" icon="🪪">
        <p className="mb-4 text-sm text-gray-600">
          Upload both sides of your government-issued ID and your selfie .
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload
            label="Front Side of ID*"
            side="idFront"
            onChange={(e) => handleFileChange(e, 'idFront')}
            isHovered={hoveredUpload === 'front'}
            onMouseEnter={() => setHoveredUpload('front')}
            onMouseLeave={() => setHoveredUpload(null)}
            error={errors.idFront}
          />
          {renderFilePreview(formData.idFront, true)}

          <FileUpload
            label="Back Side of ID*"
            side="idBack"
            onChange={(e) => handleFileChange(e, 'idBack')}
            isHovered={hoveredUpload === 'back'}
            onMouseEnter={() => setHoveredUpload('back')}
            onMouseLeave={() => setHoveredUpload(null)}
            error={errors.idBack}
          />
          {renderFilePreview(formData.idBack, true)}

          <FileUpload
            label="Selfie*"
            side="selfie"
            onChange={(e) => handleFileChange(e, 'selfie')}
            isHovered={hoveredUpload === 'selfie'}
            onMouseEnter={() => setHoveredUpload('selfie')}
            onMouseLeave={() => setHoveredUpload(null)}
            error={errors.selfie}
          />
          {renderFilePreview(formData.selfie, true)}
        </div>
      </Section>

      {/* Background Check Section */}
      <Section title="Background Declaration" icon="🔍">
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium">
            Do you have any criminal record?*
          </label>
          <div className="flex flex-wrap gap-4">
            <RadioButton
              name="criminalRecord"
              value="no"
              label="No"
              checked={criminalRecord === "No"}
              onChange={() => setCriminalRecord("No")}
            />
            <RadioButton
              name="criminalRecord"
              value="yes"
              label="Yes"
              checked={criminalRecord === "Yes"}
              onChange={() => setCriminalRecord("Yes")}
            />
          </div>
          {criminalRecord === "Yes" && (
            <div className="mt-3">
              <label className="block text-gray-700 font-medium mb-1">
                Please provide details of the offence*
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Minor traffic offence in 2020"
                className="w-full px-4 py-2 text-black font-medium rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Consent Section */}
      <Section title="Terms & Conditions" icon="📝">
        <div className="space-y-3">
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
  );
}
