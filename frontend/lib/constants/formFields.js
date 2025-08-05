export const PERSONAL_INFO_FIELDS = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    icon: 'user',
    required: true,
    validation: value => !!value.trim()
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    icon: 'user',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    icon: 'email',
    required: true,
    validation: validateEmail
  },
  // Add more field configurations as needed
];

export const ADDRESS_FIELDS = [
  {
    name: 'street',
    label: 'Street Address',
    type: 'text',
    icon: 'location',
    required: true
  },
  // Add more address fields
];