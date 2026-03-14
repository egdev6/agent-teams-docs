import React from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from '../pages/index.module.css';

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  highlight?: boolean;
};

export default function FeatureCard({ icon, title, description, href, highlight = false }: Props) {
  const content = (
    <article className={styles.feature + (highlight ? ' ' + styles.featureHighlight : '')} aria-label={title}>
      <div className={styles.featureIconBox}>{icon}</div>
      <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
      <p className={styles.featureDesc}>{description}</p>
      {href && (
        <span className={styles.featureCta}>
          <Translate id="homepage.feature.learnMore">Learn more</Translate>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </article>
  );

  return href ? <Link to={href} className={styles.featureLink}>{content}</Link> : content;
}
