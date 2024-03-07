// These are the same constants as in the backend directory. 
// However, they were included here so the frontend could use them as well.

const RACE_ETHNICITY = [
    'Asian',
    'Indigenous American or Native Alaskan',
    'Black or African American',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Latino',
    'Other'
];

const GENDER = [
    'Male',
    'Female',
    'Non-binary',
    'Other'
];

const LANGUAGES = [
    'English',
    'Frainçaise',
    'Portuguese',
    'Arabic',
    'Lingala',
    'Kirundi',
    'Español',
    'Other'
];

const INSTRUMENTS = [
    'Violin', 'Viola', 'Cello', 'Other'
];

const COUNTRIES = [
    'United States',
    'Canada',
    // ... Other countries if needed later
]

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const CANADIAN_PROVINCES = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

const WEEKDAYS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]
const USER_TYPES = [
    'Admin', 'Instructor', 'Parent', 'Student'
];

module.exports = {
    GENDER,
    RACE_ETHNICITY,
    LANGUAGES,
    INSTRUMENTS,
    COUNTRIES,
    US_STATES,
    CANADIAN_PROVINCES,
    WEEKDAYS,
    USER_TYPES
};