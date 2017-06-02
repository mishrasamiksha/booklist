import {hashOf} from 'applicationRoot/rootReducer';
import {BooksModuleType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';

import { createSelector } from 'reselect';
import {
    LOAD_BOOKS,
    LOAD_BOOKS_RESULTS,
    TOGGLE_SELECT_BOOK,
    BOOK_READ_CHANGING,
    BOOK_READ_CHANGED,
    TOGGLE_CHECK_ALL,
    SET_PENDING_DELETE_BOOK,
    CANCEL_PENDING_DELETE_BOOK,
    DELETE_BOOK,
    BOOK_DELETING,
    BOOK_DELETED,
    EDITORIAL_REVIEWS_LOADING,
    EDITORIAL_REVIEWS_LOADED    
} from './actionNames';

import { SUBJECT_DELETED } from '../subjects/actionNames';
import { SET_BOOKS_SUBJECTS } from '../booksSubjectModification/actionNames';
import { SET_BOOKS_TAGS } from '../booksTagModification/actionNames';
import { EDITING_BOOK_SAVED } from '../editBook/actionNames';

import { BOOK_SAVED, MANUAL_BOOK_SAVED } from 'modules/scan/reducers/actionNames';

interface IEditorialReview {
    content: string;
    source: string;
}

export interface IBookRaw {
    _id: string;
    dateAdded: number;
    ean: string;
    editorialReviews: IEditorialReview[];
    isRead: boolean;
    readChanging?: boolean;
    isbn: string;
    smallImage: string;
    mediumImage: string;
    pages: any;
    publicationDate: any;
    publisher: string;
    authors: string[];
    subjects: string[];
    tags: string[];
    title: string;
    titleLower: string;
    userId: string;
    deleting?: boolean;
    pendingDelete?: boolean;
    expanded: boolean;
    editorialReviewsLoaded: boolean;
    editorialReviewsLoading: boolean;
}

export interface IBookDisplay extends IBookRaw {
    subjectObjects: any[];
    tagObjects: any[];
    dateAddedDisplay: string;
}

const initialBooksState = {
    booksHash: hashOf<IBookRaw>(),
    booksLoading: false,
    selectedBooks: {},
    reloadOnActivate: false,
    initialQueryFired: false
};
export type booksType = typeof initialBooksState;

export function booksReducer(state = initialBooksState, action) : booksType{
    switch(action.type) {
        case LOAD_BOOKS:
            return Object.assign({}, state, { booksLoading: true, initialQueryFired: true, reloadOnActivate: false });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { booksLoading: false, selectedBooks: {}, booksHash: createBooksHash(action.books) });
        case EDITING_BOOK_SAVED:
            let newBookVersion = Object.assign({}, state.booksHash[action.book._id], action.book); //only update fields sent
            return Object.assign({}, state, { booksHash: { ...state.booksHash, [action.book._id]: newBookVersion } });
        case TOGGLE_SELECT_BOOK:
            return Object.assign({}, state, { selectedBooks: { ...state.selectedBooks, [action._id]: !state.selectedBooks[action._id] } });
        case SET_BOOKS_SUBJECTS:
            var newBookHash = { ...state.booksHash };

            action.books.forEach(_id => {
                let book = newBookHash[_id],
                    booksSubjects = new Set<string>([...book.subjects, ...action.add]);

                action.remove.forEach(s => booksSubjects.delete(s));
                newBookHash[_id] = {...book, subjects: Array.from(booksSubjects.keys())};
            });

            return Object.assign({}, state, { booksHash: newBookHash });
        case SET_BOOKS_TAGS:
            var newBookHash = { ...state.booksHash };

            action.books.forEach(_id => {
                var book = newBookHash[_id],
                    booksTags = new Set<string>([...book.tags, ...action.add]);

                action.remove.forEach(t => booksTags.delete(t));
                newBookHash[_id] = {...book, tags: Array.from(booksTags.keys())};
            });

            return Object.assign({}, state, { booksHash: newBookHash });
        case BOOK_SAVED:
        case MANUAL_BOOK_SAVED:
            return Object.assign({}, state, { reloadOnActivate: true });
        case BOOK_READ_CHANGING:{
            let changingBooks = action._ids.reduce((hash, _id) => (hash[_id] = { ...state.booksHash[_id], readChanging: true }, hash), {});
            return Object.assign({}, state, { booksHash: { ...state.booksHash, ...changingBooks } });
        } case BOOK_READ_CHANGED:{
            let changingBooks = action._ids.reduce((hash, _id) => (hash[_id] = { ...state.booksHash[_id], readChanging: false, isRead: action.value }, hash), {});
            return Object.assign({}, state, { booksHash: { ...state.booksHash, ...changingBooks } });
        }
        case TOGGLE_CHECK_ALL:
            let selectedCount = Object.keys(state.selectedBooks).length,
                allBooksCount = Object.keys(state.booksHash).length,
                newSelectedHash = {};

            if (!selectedCount || (selectedCount && allBooksCount != selectedCount)){
                newSelectedHash = Object.keys(state.booksHash).reduce((hash, _id) => (hash[_id] = true, hash), {});
            }
            return Object.assign({}, state, { selectedBooks: newSelectedHash });
        case SET_PENDING_DELETE_BOOK:
            return { ...state, booksHash: { ...state.booksHash, [action._id]: { ...state.booksHash[action._id], pendingDelete: true } } };
        case CANCEL_PENDING_DELETE_BOOK:
            return { ...state, booksHash: { ...state.booksHash, [action._id]: { ...state.booksHash[action._id], pendingDelete: false } } };
        case BOOK_DELETING:
            return { ...state, booksHash: { ...state.booksHash, [action._id]: { ...state.booksHash[action._id], deleting: true } } };
        case BOOK_DELETED:
            let newBooksHash = { ...state.booksHash };
            delete newBooksHash[action._id];
            return { ...state, booksHash: newBooksHash };

        case EDITORIAL_REVIEWS_LOADING:
            return {...state, booksHash: {...state.booksHash, [action._id]: { ...state.booksHash[action._id], editorialReviewsLoading: true }}};
        case EDITORIAL_REVIEWS_LOADED:
            return state;             
    }
    return state;
}

function createBooksHash(booksArr){
    let result = {};
    booksArr.forEach(book => {
        if (!book.subjects){
            book.subjects = [];
        }
        if (!book.tags){
            book.tags = [];
        }
        result[book._id] = book
    });
    return result;
}

export type booksListType = {
    booksLoading: boolean,
    booksList: IBookDisplay[]
}
export const selectBookList = createSelector<BooksModuleType, booksListType, boolean, any, any, any>(
    state => state.booksModule.books.booksLoading,
    state => state.booksModule.books.booksHash,
    state => state.app.subjectHash,
    state => state.booksModule.tags.tagHash,
    (booksLoading, booksHash, subjectsHash, tagHash) => {
        let books = Object.keys(booksHash).map(_id => booksHash[_id]);
        books.forEach(b => {
            b.subjectObjects = (b.subjects || []).map(s => subjectsHash[s]).filter(s => s);
            b.tagObjects = (b.tags || []).map(s => tagHash[s]).filter(s => s);
            b.authors = b.authors || [];

            let d = new Date(+b.dateAdded);
            b.dateAddedDisplay = `${(d.getMonth()+1)}/${d.getDate()}/${d.getFullYear()}`;
        });
        return { booksList: books, booksLoading };
    }
);

export type bookSelectionType = {
    allAreChecked: boolean;
    selectedBooksCount: number;
}
export const selectBookSelection = createSelector<BooksModuleType, bookSelectionType, any, any>(
    state => state.booksModule.books.booksHash,
    state => state.booksModule.books.selectedBooks,
    (booksHash, selectedBooks) => {
        let selectedIds = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
        return {
            allAreChecked: Object.keys(booksHash).length == selectedIds,
            selectedBooksCount: selectedIds
        }
    }
);