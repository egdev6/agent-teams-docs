import React from 'react';
import OriginalLocaleDropdown from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/NavbarItem/LocaleDropdownNavbarItem';

const LOCALE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
};

export default function LocaleDropdownNavbarItem(props: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const flag = LOCALE_FLAGS[currentLocale] ?? '🌐';

  return (
    <div id="locale-switcher">
      <span className="locale-switcher__flag">{flag}</span>
      <OriginalLocaleDropdown {...props} />
    </div>
  );
}
