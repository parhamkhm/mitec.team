// Status machine for admin order management (an extension beyond
// API_CONTRACT.md, which only specifies the shape of a status — this is
// what actually populates it over time so /track means something).
export const STATUS_LABELS = {
  received: 'دریافت شد',
  in_design: 'در مرحله طراحی',
  in_dev: 'در حال توسعه',
  review: 'در حال بازبینی',
  delivered: 'تحویل داده شد',
  cancelled: 'لغو شده'
};

export const ORDER_STATUSES = Object.keys(STATUS_LABELS);
