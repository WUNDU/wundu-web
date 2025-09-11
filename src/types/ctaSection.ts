export interface CtaSectionProps {
  title: string;
  subtitle: string;
  isError?: boolean
}

export interface DetailsSectionProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}
