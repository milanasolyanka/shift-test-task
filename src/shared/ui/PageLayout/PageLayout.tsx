import type { ReactNode } from 'react';
import styles from './PageLayout.module.scss';

type PageLayoutProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function PageLayout({ children, description, title }: PageLayoutProps) {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {children}
      </section>
    </main>
  );
}
