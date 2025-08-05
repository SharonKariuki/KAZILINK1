'use client';

import { useState } from 'react';
import { validateEmail, validateRequired } from '@/lib/utils/validation';

export const useRegistrationForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Personal Information
    if (!validateRequired(formData.firstName)) newErrors.firstName = 'First name is required';
    if (!validateRequired(formData.lastName)) newErrors.lastName = 'Last name is required';
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validateRequired(formData.phone)) newErrors.phone = 'Phone number is required';
    if (!validateRequired(formData.dob)) newErrors.dob = 'Date of birth is required';
    if (!validateRequired(formData.gender)) newErrors.gender = 'Gender is required';

    // Address
    if (!validateRequired(formData.street)) newErrors.street = 'Street address is required';
    if (!validateRequired(formData.city)) newErrors.city = 'City is required';
    if (!validateRequired(formData.state)) newErrors.state = 'State/Province is required';
    if (!validateRequired(formData.zip)) newErrors.zip = 'Zip code is required';
    if (!validateRequired(formData.country)) newErrors.country = 'Country is required';

    // Work
    if (!validateRequired(formData.occupation)) newErrors.occupation = 'Occupation is required';
    if (!validateRequired(formData.experience)) newErrors.experience = 'Experience is required';

    // Education — optional fields (no validation)

    // ID Verification
    if (!formData.idFront) newErrors.idFront = 'Front ID is required';
    if (!formData.idBack) newErrors.idBack = 'Back ID is required';

    // CV Upload
    if (!formData.cv) newErrors.cv = 'CV is required';

    // Certifications (only if they indicated yes)
    if (formData.hasCert) {
      if (!validateRequired(formData.certificationName)) {
        newErrors.certificationName = 'Certification name is required';
      }
      if (!validateRequired(formData.issuingOrg)) {
        newErrors.issuingOrg = 'Issuing organization is required';
      }
      if (!validateRequired(formData.certificationDate)) {
        newErrors.certificationDate = 'Certification date is required';
      }
      if (!formData.certificate) {
        newErrors.certificate = 'Certificate file is required';
      }
    }

    // Background Check (only if criminal record is Yes)
    if (formData.criminalRecord === 'Yes') {
      if (!validateRequired(formData.explanation)) {
        newErrors.explanation = 'Please explain your criminal record';
      }
    }

    // Consent
    if (!formData.confirmInfo) newErrors.confirmInfo = 'You must confirm the information';
    if (!formData.consent) newErrors.consent = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleFileChange,
    validate
  };
};
