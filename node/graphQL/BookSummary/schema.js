export const type = `
  
  type BookSummary {
    _id: String
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    smallImagePreview: String
    mediumImage: String
    mediumImagePreview: String
    authors: [String]
  }

  type BookSummaryQueryResults {
    BookSummarys: [BookSummary!]!
    Meta: QueryResultsMetadata!
  }

  type BookSummarySingleQueryResult {
    BookSummary: BookSummary
  }

  type BookSummaryMutationResult {
    BookSummary: BookSummary
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BookSummaryMutationResultMulti {
    BookSummarys: [BookSummary]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BookSummaryBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input BookSummaryInput {
    _id: String
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    smallImagePreview: String
    mediumImage: String
    mediumImagePreview: String
    authors: [String]
  }

  input BookSummaryMutationInput {
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    smallImagePreview: String
    mediumImage: String
    mediumImagePreview: String
    authors: [String]
    authors_PUSH: String
    authors_CONCAT: [String]
    authors_UPDATE: StringArrayUpdate
    authors_UPDATES: [StringArrayUpdate]
    authors_PULL: [String]
    authors_ADDTOSET: [String]
  }

  input BookSummarySort {
    _id: Int
    title: Int
    asin: Int
    isbn: Int
    ean: Int
    smallImage: Int
    smallImagePreview: Int
    mediumImage: Int
    mediumImagePreview: Int
    authors: Int
  }

  input BookSummaryFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    _id_nin: [String]
    title_contains: String
    title_startsWith: String
    title_endsWith: String
    title_regex: String
    title: String
    title_ne: String
    title_in: [String]
    title_nin: [String]
    asin_contains: String
    asin_startsWith: String
    asin_endsWith: String
    asin_regex: String
    asin: String
    asin_ne: String
    asin_in: [String]
    asin_nin: [String]
    isbn_contains: String
    isbn_startsWith: String
    isbn_endsWith: String
    isbn_regex: String
    isbn: String
    isbn_ne: String
    isbn_in: [String]
    isbn_nin: [String]
    ean_contains: String
    ean_startsWith: String
    ean_endsWith: String
    ean_regex: String
    ean: String
    ean_ne: String
    ean_in: [String]
    ean_nin: [String]
    smallImage_contains: String
    smallImage_startsWith: String
    smallImage_endsWith: String
    smallImage_regex: String
    smallImage: String
    smallImage_ne: String
    smallImage_in: [String]
    smallImage_nin: [String]
    smallImagePreview_contains: String
    smallImagePreview_startsWith: String
    smallImagePreview_endsWith: String
    smallImagePreview_regex: String
    smallImagePreview: String
    smallImagePreview_ne: String
    smallImagePreview_in: [String]
    smallImagePreview_nin: [String]
    mediumImage_contains: String
    mediumImage_startsWith: String
    mediumImage_endsWith: String
    mediumImage_regex: String
    mediumImage: String
    mediumImage_ne: String
    mediumImage_in: [String]
    mediumImage_nin: [String]
    mediumImagePreview_contains: String
    mediumImagePreview_startsWith: String
    mediumImagePreview_endsWith: String
    mediumImagePreview_regex: String
    mediumImagePreview: String
    mediumImagePreview_ne: String
    mediumImagePreview_in: [String]
    mediumImagePreview_nin: [String]
    authors_count: Int
    authors_textContains: String
    authors_startsWith: String
    authors_endsWith: String
    authors_regex: String
    authors: [String]
    authors_in: [[String]]
    authors_nin: [[String]]
    authors_contains: String
    authors_containsAny: [String]
    authors_containsAll: [String]
    authors_ne: [String]
    OR: [BookSummaryFilters]
  }
  
`;

export const mutation = `

  updateBookSummary (
    _id: String,
    Updates: BookSummaryMutationInput
  ): BookSummaryMutationResult

`;

export const query = `

  allBookSummarys (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    _id_nin: [String],
    title_contains: String,
    title_startsWith: String,
    title_endsWith: String,
    title_regex: String,
    title: String,
    title_ne: String,
    title_in: [String],
    title_nin: [String],
    asin_contains: String,
    asin_startsWith: String,
    asin_endsWith: String,
    asin_regex: String,
    asin: String,
    asin_ne: String,
    asin_in: [String],
    asin_nin: [String],
    isbn_contains: String,
    isbn_startsWith: String,
    isbn_endsWith: String,
    isbn_regex: String,
    isbn: String,
    isbn_ne: String,
    isbn_in: [String],
    isbn_nin: [String],
    ean_contains: String,
    ean_startsWith: String,
    ean_endsWith: String,
    ean_regex: String,
    ean: String,
    ean_ne: String,
    ean_in: [String],
    ean_nin: [String],
    smallImage_contains: String,
    smallImage_startsWith: String,
    smallImage_endsWith: String,
    smallImage_regex: String,
    smallImage: String,
    smallImage_ne: String,
    smallImage_in: [String],
    smallImage_nin: [String],
    smallImagePreview_contains: String,
    smallImagePreview_startsWith: String,
    smallImagePreview_endsWith: String,
    smallImagePreview_regex: String,
    smallImagePreview: String,
    smallImagePreview_ne: String,
    smallImagePreview_in: [String],
    smallImagePreview_nin: [String],
    mediumImage_contains: String,
    mediumImage_startsWith: String,
    mediumImage_endsWith: String,
    mediumImage_regex: String,
    mediumImage: String,
    mediumImage_ne: String,
    mediumImage_in: [String],
    mediumImage_nin: [String],
    mediumImagePreview_contains: String,
    mediumImagePreview_startsWith: String,
    mediumImagePreview_endsWith: String,
    mediumImagePreview_regex: String,
    mediumImagePreview: String,
    mediumImagePreview_ne: String,
    mediumImagePreview_in: [String],
    mediumImagePreview_nin: [String],
    authors_count: Int,
    authors_textContains: String,
    authors_startsWith: String,
    authors_endsWith: String,
    authors_regex: String,
    authors: [String],
    authors_in: [[String]],
    authors_nin: [[String]],
    authors_contains: String,
    authors_containsAny: [String],
    authors_containsAll: [String],
    authors_ne: [String],
    OR: [BookSummaryFilters],
    SORT: BookSummarySort,
    SORTS: [BookSummarySort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): BookSummaryQueryResults!

  getBookSummary (
    _id: String
  ): BookSummarySingleQueryResult!

`;
