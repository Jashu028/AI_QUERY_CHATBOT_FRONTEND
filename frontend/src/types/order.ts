export interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  amount: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type ReturnStatus =
  | "Not Requested"
  | "Requested"
  | "Approved"
  | "Rejected"
  | "Processed";

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  returnRequested: boolean;
  returnStatus: ReturnStatus;
  refundAmount: number;
  refundProcessed: boolean;
  returnReason?: string;
}
