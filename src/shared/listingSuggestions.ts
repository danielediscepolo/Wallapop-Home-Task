export type ListingSuggestions = {
  status: "complete";
  title: string;
  tags: string[];
  priceRange: {
    min: number;
    max: number;
    currency: "EUR";
  };
};
