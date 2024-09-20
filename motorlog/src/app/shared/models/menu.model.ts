export interface MenuItemModel {
    route: string;
    url: string;
    icon: string;
    name: string;
}
export interface SettingsSectionModel {
  section: string;
  items: SettingsItemModel[];
}
export interface SettingsItemModel {
  label: string;
  icon: string;
  action?: string; // Solo si es un ítem de acción
  items?: SettingsItemModel[]; // Para submenús
}
