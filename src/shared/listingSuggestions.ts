export type PriceRange = {
  min: number;
  max: number;
  currency: "EUR";
};

type CompleteListingSuggestions = {
  status: "complete";
  title: string;
  tags: string[];
  priceRange: PriceRange;
};

type LimitedListingSuggestions = {
  status: "limited";
  title: string;
  tags: string[];
  priceRange: PriceRange;
  tip: string;
};

type NeedsMoreInformationListingSuggestions = {
  status: "needs_more_information";
  message: string;
};

export type ListingSuggestions =
  | CompleteListingSuggestions
  | LimitedListingSuggestions
  | NeedsMoreInformationListingSuggestions;
