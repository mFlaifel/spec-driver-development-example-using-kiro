import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Select } from './Select';
import type { CountryCode } from '../types';

export function CountrySelector() {
  const { country, availableCountries, changeCountry } = useLocation();
  const { language } = useLanguage();

  const options = availableCountries.map((c) => ({
    value: c.code,
    label: language === 'en' ? c.name : c.nameAr,
    labelAr: language === 'en' ? c.nameAr : c.name,
  }));

  const handleChange = (value: string) => {
    changeCountry(value as CountryCode);
  };

  return (
    <Select
      label={language === 'en' ? 'Country' : 'البلد'}
      options={options}
      value={country.code}
      onChange={handleChange}
    />
  );
}

export default CountrySelector;
