export interface NavTabModel {
  route: string;
  icon: string;
  labelKey: string;
}

export interface MenuDataModel {
  menuItems: NavTabModel[];
}
