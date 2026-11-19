type NotificationProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  lida?: boolean;
  marking?: boolean;
  onMarkRead?: (id: string) => void;
};

type NotificationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};
