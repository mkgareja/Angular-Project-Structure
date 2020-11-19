export class API {
  public static pageLimit = 5;
  public static otherLocationId = '9999';

  public static ADMIN_ROUTES = {
    adminProfile: '/admin/profile',
    adminUpdateProfile: '/admin/profile',
    adminHome: 'admin/home',
  };

  public static LOGIN_ROUTES = {
    login: 'auth/sign-in',
  };

  public static FORGOT_PASSWORD_ROUTES = {
    forgotPassword: 'auth/forgot-password',
  };

  public static RESET_PASSWORD_ROUTES = {
    resetPassword: 'auth/reset-password',
  };

  public static SIGN_UP_ROUTES = {
    signUp: 'auth/sign-up',
    categories: '/categories',
    countries: 'masters/countries',
    states: 'masters/states/',
    cities: '/masters/cities/',
  };

  public static SET_TIME_ROUTES = {
    setTime: 'store/time',
  };

  public static STORE = {
    getStore: 'store/',
  };

  public static PRODUCT_ROUTES = {
    deleteProduct: 'products/',
    enableProduct: 'products/status',
    products: 'store/',
    productList: '/product?skip=',
    editProduct: 'products/',
    saveProduct: 'products',
    uploadCSV: 'products/csv/',
    scanProduct: 'products/scan',
    productReview: '/review'
  };

  public static IMAGE_UPLOAD = {
    uploadImage: 'common/upload-file',
  };

  public static CHANGE_PASSWORD_ROUTES = {
    changePassword: 'auth/change-password',
  };

  public static STORE_ROUTES = {
    getStore: 'store/',
  };
}
