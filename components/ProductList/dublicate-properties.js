export const DUBLICATE_PROPERTIES = [
  {
    id: 1,
    title: "Descrizione",
    description:
      "La descrizione del prodotto permette di raccontare il prodotto e come è stato realizzato.",
    properties: ["name"],
    type: "string"
  },
  {
    id: 2,
    title: "Condizione prodotto",
    description: "Indica se il prodotto è nuovo, riciclato o vintage.",
    properties: ["is_new"],
    type: "string"
  },
  {
    id: 3,
    title: "Prezzo",
    description:
      "La copia comprende la duplicazione del prezzo intero e del prezzo scontato (se inserito).",
    properties: ["unit_price", "sale_price"],
    type: "string"
  },
  {
    id: 4,
    title: "Categorie",
    description:
      "La copia comprende la duplicazione della categoria del prodotto e di eventuali sottocategorie.",
    properties: ["product_categories_attributes"],
    type: "array"
  },
  {
    id: 5,
    title: "Spedizioni",
    description:
      "La copia comprende la duplicazione della spedizione inserita nel prodotto.",
    properties: ["shipping_options_attributes"],
    type: "array"
  },
  {
    id: 6,
    title: "Composizioni",
    description:
      "La copia comprende la duplicazione della composizione ed il peso degli elementi.",
    properties: ["Composizione"]
  },
  {
    id: 7,
    title: "Allergeni",
    description:
      "La copia comprende la duplicazione delle sostanze che possono provocare allergie o intolleranze.",
    properties: ["Allergeni"]
  }
];
