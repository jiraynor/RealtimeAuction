export class RegistDto {
  item_name: string;
  item_category: string;
  number_of_item: number;
  appraisal_value: number;
  lowest_selling_price: number;
  immediate_sale_price: number;
  item_note: string;
  deadline: string;
}

export class UpdateDto {
  auction_num: number;
  item_name: string;
  item_category: string;
  number_of_item: number;
  appraisal_value: number;
  lowest_selling_price: number;
  immediate_sale_price: number;
  item_note: string;
  deadline: string;
}
