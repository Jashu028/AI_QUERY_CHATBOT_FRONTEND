export interface Admin {
  _id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  productId: string;
  description: string;
  image: string;
  price: number;
}

export interface OrderProduct {
  product_Id: {
    name: string;
    image: string;
  };
  quantity: number;
  amount: number;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  orderStatus: string;
  returnStatus: string;
  createdAt: string;
}

export interface AdminStore {
  admin: Admin | null;
  fetchAdmin: () => Promise<void>;

  fetchAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, updates: Partial<Pick<Order, 'orderStatus' | 'returnStatus'>>) => Promise<void>;

  fetchAllProducts: () => Promise<Product[]>;
  addProduct: (productData: Omit<Product, '_id'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}


