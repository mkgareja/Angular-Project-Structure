import { Constants, URL_ROUTES } from '@constant/constants';
const categoryId = localStorage.getItem(Constants.CATEGORYID);
export const adminLteConf = {
  skin: 'blue',
  sidebarLeftMenu: [
    {
      label: categoryId === "4" ? 'Dishes' : 'Products',
      route: URL_ROUTES.STORE_HOME,
      iconClasses: categoryId === "4" ? 'fa fa-cutlery' : 'fa fa-shopping-cart',
    },
    {
      label: 'Edit Store',
      route: URL_ROUTES.STORE_DETAIL + localStorage.getItem(Constants.SID),
      iconClasses: 'fa fa-tachometer',
    },
    {
      label: 'Batch Upload',
      route: URL_ROUTES.BATCH_UPLOAD,
      iconClasses: 'fa fa-upload',
    },
    {
      label: 'Change Password',
      route: URL_ROUTES.CHANGE_PASSWORD,
      iconClasses: 'fa fa-key',
    },
    {
      label: 'Logout',
      route: URL_ROUTES.LOGIN,
      iconClasses: 'fa fa-sign-out',
    },
  ],
};
