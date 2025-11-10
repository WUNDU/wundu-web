export interface ProfileTemplateProps {
  userName: string;
  onEditAvatar?: () => void;
  onMenuItemClick: (menuText: string) => void;
  onControlPanelClick?: () => void;
}