export interface NavTabModel {
  route: string;
  icon: string;
  labelKey: string;
}

export interface MenuDataModel {
  menuItems: NavTabModel[];
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
