export const TABLE_COLUMNS = [
  {
    label: "Prodotto",
    alias: "image",
    sortOrder: "default",
    sortBy: "name",
    type: "string"
  },
  {
    label: "Quantità disponibile",
    alias: "amount",
    sortOrder: "default",
    sortBy: "num_in_stock",
    type: "number"
  },
  {
    label: "Prezzo / Prezzo Scontato",
    alias: "price",
    sortOrder: "default",
    sortBy: "sale_price",
    type: "number"
  },
  {
    label: "Pubblicazione",
    alias: "publish",
    sortOrder: "default",
    sortBy: "is_active",
    type: "boolean"
  }
];
