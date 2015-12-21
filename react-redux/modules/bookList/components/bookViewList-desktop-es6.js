const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const { toggleSelectBook, editSubjects, stopEditingSubjects, setNewSubjectName, setNewSubjectParent, editSubject, updateSubject } = require('../actions/actionCreators');
const Modal = ReactBootstrap.Modal;
const HierarchicalSubjectList = require('./hierarchicalSubjectList');
const editSubjectStateCollection = Symbol('editSubjectStateCollection');
const BookSearchDesktop = require('./BookSearch-desktop');

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    closeEditBooksSubjectsModal(){
        this.setState({ booksSubjectsModalShown: false });
    }
    singleSelectBook(book){
        this.setState({ booksSubjectsModalShown: true, editSubjectsFor: [book], subjectsRemoving: [], subjectsAdding: [] });
    }
    multiBookSubjectsModal(){
        this.setState({ booksSubjectsModalShown: true, editSubjectsFor: this.props.books.list.filter(b => b.selected), subjectsRemoving: [], subjectsAdding: [] })
    }
    toggleAddSubjectPending(subject, toggledOn){
        this[editSubjectStateCollection](subject, toggledOn, 'subjectsAdding');
    }
    toggleRemoveSubjectPending(subject, toggledOn){
        this[editSubjectStateCollection](subject, toggledOn, 'subjectsRemoving');
    }
    [editSubjectStateCollection](subject, toggledOn, stateName){
        let updated = this.state[stateName].concat();
        if (toggledOn){
            updated.push(subject);
        } else {
            updated = updated.filter(s => s._id !== subject._id);
        }
        this.setState({ [stateName]: updated });
    }
    render(){
        return (
            <div>
                <BookSearchDesktop></BookSearchDesktop>
                <br />
                { this.props.selectedCount ? <BootstrapButton preset="primary-sm" onClick={() => this.multiBookSubjectsModal()}>Set subjects</BootstrapButton> : null }
                &nbsp;&nbsp;&nbsp;
                <BootstrapButton preset="primary-sm" onClick={this.props.editSubjects}>Edit subjects</BootstrapButton>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                            <th></th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genres</th>
                            <th>ISBN</th>
                            <th>Published</th>
                            <th>Pages</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.props.books.list.map(book =>
                        <tr key={book._id}>
                            <td>
                                <i onClick={() => this.props.toggleSelectBook(book._id)} className={'fa ' + (book.selected ? 'fa-check-square-o' : 'fa-square-o')} style={{ cursor: 'pointer' }}></i>
                            </td>
                            <td><img src={book.smallImage} /></td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                { book.subjectObjects.map(s => <li key={s._id}>{s.name}</li>) }
                                <button onClick={() => this.singleSelectBook(book)}>Open</button>
                            </td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                            <td>{book.pages}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <Modal show={this.state.booksSubjectsModalShown} onHide={() => this.closeEditBooksSubjectsModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects for:
                            <div>{this.state.editSubjectsFor.map(b => <h5 key={b._id}>{b.title}</h5>)}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b>Add</b> { this.state.subjectsAdding.map(s => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" onChange={e => this.toggleAddSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>

                        <div>
                            <b>Remove</b> { this.state.subjectsRemoving.map(s => <span className="label label-danger" style={{ marginRight: 5, display: 'inline-block' }} key={s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" onChange={e => this.toggleRemoveSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => this.closeEditBooksSubjectsModal()}>Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={!!this.props.subjects.editSubjectsPacket} onHide={this.props.stopEditingSubjects}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <HierarchicalSubjectList subjects={this.props.subjects.list} onEdit={_id => this.props.editSubject(_id)} />

                        { this.props.subjects.editSubjectsPacket && this.props.subjects.editSubjectsPacket.editingSubject ?
                            <div>
                                { this.props.subjects.editSubjectsPacket.editingSubject._id ? `Edit subject ${this.props.subjects.editSubjectsPacket.editingSubject.name}` : 'New Subject' }
                                <br/>
                                New name: <input value={this.props.subjects.editSubjectsPacket.newSubjectName} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                                New Parent:
                                <select value={this.props.subjects.editSubjectsPacket.newSubjectParent} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                    <option value="">None</option>
                                    { this.props.subjects.editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                </select>
                                <BootstrapButton onClick={() => this.props.updateSubject()}>Save</BootstrapButton>
                            </div>
                            : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.props.stopEditingSubjects}>Close</button>
                    </Modal.Footer>
                </Modal>                
            </div>
        );
    }
}

module.exports = BookViewListDesktop;