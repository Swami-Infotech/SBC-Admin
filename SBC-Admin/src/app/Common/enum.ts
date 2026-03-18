export enum UserType {
  Admin = 0,
  SubAdmin = 1,
  Member = 2,
  LT = 3,
}

export enum AboutUsType {
  Text = 0,
  image = 1,
  video = 2,
}



export enum ModuleLists {
  Home = 0,
  Staff = 1,
  Users = 2,
  Testimonial = 3,
  PackageCategory = 4,
  Packages = 5,
  Camp = 6,
  Sliders = 7,
  Branch = 8,
  HealthTip = 9,
  Support = 10,
  BookFromUS = 11,
  Report = 12,
  Preferences = 13,
  LiveLink = 14,
  prescription = 15,
}

export enum ModuleAccesssView {
  View = 0,
  ViewAndAdd = 1,
  ViewAddUpdate = 2,
  ViewAddUpdateDelete = 3,
}

export enum DiscountType {
  Flat = 0,
  Percentage = 1,
}

export enum AttachmentType {
  image = 0,
  video = 1,
}

export interface CartItem {
  ProductName: string;
  ProductPrice: number;
  productImage: string;
  Attributes: any[];
  Quantity: number;
  Mrp: number;
  DiscountType: number;
  DiscountRate: any;

  GSTPercentage: number;
  GSTAmount: string;

  FinalAmount: number;

  isCombo: boolean;

  plantName: string;
  plantImage: string;
  plantPrice: number;
  plantQuantity: number;
  plantFinalPrice: number;
}

export interface checkout {
  userID: number;
  invoiceIdentity: number;
  customerID: number;
  totalPrice: number;
  totalProducts: number;
  totalProductsQuantity: number;
  overAllDiscount: number;
  orderDueDate: string;
  termsIDs: { termsID: number }[];
  invoiceProductInputs: [
    {
      productName: string;
      productImage: string;
      productPrice: 0;
      discountedPrice: 0;
      quantity: 0;
      discountType: 0;
      discountRate: 0;
      GSTPercentage: number;
      GSTAmount: string;
      finalPrice: 0;
      plantName: string;
      plantImage: string;
      plantPrice: 0;
      isCombo: true;
      plantQuantity: 0;
      plantFinalPrice: 0;
      invoiceProductAttributeInputs: [
        {
          productAttributeID: 0;
          productAttributeValueID: 0;
        }
      ];
    }
  ];
}

export interface Role {
  userID: number;
  adminId: number;
  rolesInputModels: Array<{
    roleID: any;
    roleAccessID: number;
    moduleList: ModuleLists;
    moduleAccesssView: ModuleAccesssView;
  }>;
}

export interface RoleAccess {
  roleAccessID: number;
  userID: number;
  moduleLists: number;
  moduleAccesssView: number;
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
}

export enum LinkType {
  Other = 0,
  Instagram = 1,
  Facebook = 2,
  Youtube = 3,
  Twitter = 4,
  Threads = 5,
}


export enum OrderStatus {
  ReviewOrder,
  PreparingOrder,
  Shipping,
  Deliverd,
  Cancelled
}
