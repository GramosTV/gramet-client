export interface SearchProduct {
  _id: string;
  name: string;
  enName: string;
  price: number;
  public: boolean;
  image: string;
  url: string;
}

export interface SearchProductRes {
  products: SearchProduct[];
  pageCount: number;
  totalCount: number;
}
