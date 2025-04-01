export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    reviews: Review[];
    favourite: Boolean;
  }
  
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }