export interface MenuItem {
  DisplayName: string;
  disabled?: boolean;
  IconName: string;
  Route?: string;
  MenuItems?: MenuItem[];
}
