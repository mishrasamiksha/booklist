import React, { FunctionComponent, useState, useRef, useMemo, useContext, useReducer, useLayoutEffect } from "react";

import Modal from "app/components/ui/Modal";
import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags";
import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags";
import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects";
import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import { CoverSmall } from "app/components/bookCoverComponent";
import { Form, SubmitIconButton } from "app/components/ui/Form";
import { SlideInContents, useHeight } from "app/animationHelpers";

import "./recommend.scss";
import { AppContext } from "app/renderUI";
import { useQuery } from "micro-graphql-react";
import { QueryOf, Queries } from "graphql-typings";

import BooksQuery from "graphQL/home/searchBooks.graphql";

import { useSpring, useTransition, animated, config } from "react-spring";

const PAGE_SIZE = 4;

interface LocalProps {
  isOpen: boolean;
  onHide: any;
  setBookSearchState: any;
  dispatch: any;
  selectedBooksSet: any;
}

const initialState = { active: false, page: 1, pageSize: 50, sort: { title: 1 }, tags: [], subjects: [] };
const searchStateReducer = (_oldState, payload) => (payload ? { active: true, page: 1, pageSize: PAGE_SIZE, ...payload } : initialState);

const SearchModal: FunctionComponent<Partial<LocalProps>> = props => {
  const [{ publicUserId }] = useContext(AppContext);
  const [{ active, ...searchState }, searchDispatch] = useReducer(searchStateReducer, initialState);

  const variables = { ...searchState, publicUserId };
  const { page } = variables;

  const { loading, loaded, data, error, currentQuery } = useQuery<QueryOf<Queries["allBooks"]>>(BooksQuery, variables, { active });
  const resultCount = data?.allBooks?.Meta?.count ?? 0;
  const totalPages = Math.ceil(resultCount / PAGE_SIZE);

  const { isOpen, onHide, dispatch, selectedBooksSet } = props;

  const pageUp = () => searchDispatch({ page: page + 1 });
  const pageDown = () => searchDispatch({ page: page - 1 });
  const pageOne = () => searchDispatch({ page: 1 });
  const pageLast = () => searchDispatch({ page: totalPages });

  let canPageUp = page < totalPages;
  let canPageDown = page > 1;
  let canPageOne = page > 1;
  let canPageLast = page < totalPages;

  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);

  const noAvailableBooks = useMemo(() => {
    const allBooks = data?.allBooks?.Books;

    return allBooks?.length && !allBooks.find(b => !selectedBooksSet.has(b._id));
  }, [selectedBooksSet, data]);

  useLayoutEffect(() => {
    if (props.isOpen) {
      setSubjects(searchState.subjects || []);
      setTags(searchState.tags || []);
      searchDispatch(null);
    }
  }, [props.isOpen]);

  const selectSubject = subject => setSubjects(subjects.concat(subject._id));
  const selectTag = tag => setTags(tags.concat(tag._id));
  const removeSubject = subject => setSubjects(subjects.filter(_id => _id != subject._id));
  const removeTag = tag => setTags(tags.filter(_id => _id != tag._id));

  const searchEl = useRef(null);
  const childSubEl = useRef(null);
  const isReadE = useRef(null);
  const isRead0 = useRef(null);
  const isRead1 = useRef(null);

  const applyFilters = () => {
    searchDispatch({
      title: searchEl.current.value || "",
      isRead: isReadE.current.checked ? void 0 : isRead0.current.checked ? false : true,
      subjects: subjects.length ? subjects : null,
      tags: tags.length ? tags : null,
      searchChildSubjects: childSubEl.current.checked
    });
  };

  return (
    <Modal {...{ isOpen, onHide, headerCaption: "Search your books" }}>
      <Form submit={applyFilters}>
        <FlexRow>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Title</label>
              <input defaultValue={searchState.title} ref={searchEl} placeholder="Search title" className="form-control" />
            </div>
          </div>

          <div className="col-xs-6">
            <Stack>
              <label className="form-label">Is read?</label>
              <FlowItems className="radio">
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == null} ref={isReadE} name="isRead" id="isReadE" />
                  <label htmlFor="isReadE">Either</label>
                </FlowItems>
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == "1"} ref={isRead1} name="isRead" id="isReadY" />
                  <label htmlFor="isReadY">Yes</label>
                </FlowItems>
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == "0"} ref={isRead0} name="isRead" id="isReadN" />
                  <label htmlFor="isReadN">No</label>
                </FlowItems>
              </FlowItems>
            </Stack>
          </div>

          <div className="col-xs-3">
            <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} />
          </div>
          <div className="col-xs-9">
            <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
          </div>

          <div className="col-xs-3">
            <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
          </div>
          <div className="col-xs-9">
            <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
          </div>

          <div className="col-xs-6">
            <div className="checkbox">
              <label>
                <input type="checkbox" ref={childSubEl} defaultChecked={!!searchState.searchChildSubjects} /> Also search child subjects
              </label>
            </div>
          </div>

          <div className="col-xs-12">
            <FlexRow>
              {loading ? (
                <button style={{ minWidth: "5ch" }} disabled={true} className="btn btn-default">
                  <i className="fa fa-fw fa-spin fa-spinner" />
                </button>
              ) : (
                <SubmitIconButton key={1} className="btn btn-default">
                  <i className="fal fa-search" />
                </SubmitIconButton>
              )}

              <CSSTransition in={noAvailableBooks} key={2} classNames="bl-animate" timeout={300}>
                <div className="bl-fade alert alert-info alert-slimmer">You've added all of the books from this page</div>
              </CSSTransition>
            </FlexRow>
          </div>

          <div className="col-xs-12">
            <div>
              {resultCount ? (
                <>
                  <FlowItems tightest={true} containerStyle={{ alignItems: "center", fontSize: "14px" }}>
                    <button onClick={pageOne} disabled={!canPageDown} className="btn btn-default">
                      <i className="fal fa-angle-double-left" />
                    </button>
                    <button onClick={pageDown} disabled={!canPageDown} className="btn btn-default">
                      <i className="fal fa-angle-left" />
                    </button>
                    <span style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                      {page} of {totalPages}
                    </span>
                    <button onClick={pageUp} disabled={!canPageUp} className="btn btn-default">
                      <i className="fal fa-angle-right" />
                    </button>
                    <button onClick={pageLast} disabled={!canPageUp} className="btn btn-default">
                      <i className="fal fa-angle-double-right" />
                    </button>
                  </FlowItems>
                  <hr />
                </>
              ) : null}
            </div>
            <SearchResults {...{ dispatch, loaded, loading, data, error, currentQuery, selectedBooksSet, active }} />
          </div>
        </FlexRow>
      </Form>
    </Modal>
  );
};

export default SearchModal;

const SearchResults = props => {
  const books = props?.data?.allBooks?.Books;
  const { selectedBooksSet, currentQuery, active } = props;
  const availableBooks = books?.filter(b => !selectedBooksSet.has(b._id));
  const currentBooksRef = useRef<any>();
  currentBooksRef.current = availableBooks;

  console.log({ selectedBooksSet });

  return (
    <div className="animate-height animate-fast" style={{ maxHeight: "300px", overflowY: "auto", marginTop: "5px", position: "relative" }}>
      <div className="overlay-holder">
        {/* <TransitionGroup component={null}> */}
        {books == null || !active ? null : books?.length ? (
          // <SlideInContents className="search-modal-result-set" animateMountingOnly={true} key={currentQuery}>
          <ul>
            {/* <TransitionGroup component={null}> */}
            {books.map(book => (
              // <SlideInContents key={book._id} component="li" className="bl-no-animate-in animate-fast bl-fade-out bl-slide-out">
              <SearchResult key={book._id} book={book} selected={selectedBooksSet.has(book._id)} dispatch={props.dispatch} />
              // </SlideInContents>
            ))}
            {/* </TransitionGroup> */}
          </ul>
        ) : (
          // </SlideInContents>
          <CSSTransition key={3} classNames="bl-animate" timeout={300}>
            <div style={{ alignSelf: "start" }} className="animate-fast bl-fade alert alert-warning">
              No results
            </div>
          </CSSTransition>
        )}
        {/* </TransitionGroup> */}
      </div>
    </div>
  );
};

const SearchResult = props => {
  const [adding, setAdding] = useState(false);

  const selectBook = () => {
    setAdding(true);
    props.dispatch(["selectBook", props.book]);
  };

  let { book, selected } = props;
  const initiallySelected = useRef(selected);

  const [sizingRef, currentHeight] = useHeight();

  const styles = useSpring({
    config: { ...config.stiff, clamp: true },
    // from: { opacity: 0 /*transform: `translate3d(0px, -10px, 0px)`*/ },
    from: {
      opacity: initiallySelected.current ? 0 : 1,
      height: initiallySelected.current ? 0 : currentHeight /*transform: `translate3d(0px, 0px, 0px)`*/
    },
    to: { opacity: selected ? 0 : 1, height: selected ? 0 : currentHeight /*transform: `translate3d(0px, 10px, 0px)`*/ }
  }) || {};

  return (
    <animated.li style={{ overflow: "hidden", ...styles }}>
      <div ref={sizingRef}>
        <Stack className={props.className}>
          <FlowItems>
            <div style={{ minWidth: "70px" }}>
              <CoverSmall url={book.smallImage} />
            </div>

            <Stack style={{ flex: 1 }}>
              {book.title}
              {book.authors && book.authors.length ? <span style={{ fontStyle: "italic", fontSize: "14px" }}>{book.authors.join(", ")}</span> : null}
              <button
                disabled={adding}
                onClick={selectBook}
                style={{ cursor: "pointer", marginTop: "auto", alignSelf: "flex-start" }}
                className="btn btn-primary btn-xs"
              >
                Add to list&nbsp;
                <i className="fal fa-plus" />
              </button>
            </Stack>
          </FlowItems>
          <hr />
        </Stack>
      </div>
    </animated.li>
  );
};
