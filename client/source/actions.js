/*
 * action types
 */
exports.ADD_DICTIONARY = 'ADD_DICTIONARY';
exports.DELETE_DICTIONARY = 'DELETE_DICTIONARY';
exports.UPDATE_DICTIONARY = 'UPDATE_DICTIONARY';
exports.START_DICTIONARY_DELETION = 'START_DICTIONARY_DELETION';
exports.RECEIVE_DICTIONARIES = 'RECEIVE_DICTIONARIES';
exports.RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';

exports.NAV_DICTIONARIES = 'NAV_DICTIONARIES';
exports.NAV_DICTIONARY = 'NAV_DICTIONARY';
exports.NAV_NEW_DICTIONARY = 'NAV_NEW_DICTIONARY';
exports.NAV_EDIT_DICTIONARY = 'NAV_EDIT_DICTIONARY';
exports.NAV_NEW_ENTRY = 'NAV_NEW_ENTRY';
exports.NAV_TRAINING = 'NAV_TRAINING';
exports.NAV_PAGE = 'NAV_PAGE'; //for pagination ??
exports.NAV_MAIN_PAGE = 'NAV_MAIN_PAGE';

exports.ADD_ENTRY = 'ADD_ENTRY';
exports.UPDATE_ENTRY = 'UPDATE_ENTRY';
exports.DELETE_ENTRY = 'DELETE_ENTRY';
exports.START_ENTRY_DELETION = 'START_ENTRY_DELETION';
exports.START_ENTRY_EDITING = 'START_ENTRY_EDITING';
exports.TRAINING_NEXT_ENTRY = 'TRAINING_NEXT_ENTRY';
exports.TRAINING_SHOW_HINT = 'TRAINING_SHOW_HINT';

exports.LOGOUT = 'LOGOUT';
exports.LOGIN_OK = 'LOGIN_OK';
exports.LOGIN_ERR = 'LOGIN_ERR';
exports.SIGNUP_ERR = 'SIGNUP_ERR';

exports.ERROR = 'ERROR';

/*
 * other constants
 */

exports.NavPositions = {
    DICTIONARY: 'DICTIONARY',
    DICTIONARIES: 'DICTIONARIES',
    TRAINING: 'TRAINING',
    NEW_DICTIONARY: 'NEW_DICTIONARY',
    NEW_ENTRY: 'NEW_ENTRY',
    EDIT_DICTIONARY: 'EDIT_DICTIONARY',
    MAIN_PAGE: 'MAIN_PAGE'
};

/*
 * action creators
 */
exports.addDictionary = (dictId, dict) => {
    return { type: exports.ADD_DICTIONARY, dictId, dict };
};

exports.error = errorMsg => {
    return { type: exports.ERROR, errorMsg };
};

exports.receiveDictionaries = dictionaries =>{
    return { type: exports.RECEIVE_DICTIONARIES, dictionaries };
};

exports.receiveEntries = (dictId, entries) =>{
    return { type: exports.RECEIVE_ENTRIES, dictId, entries };
};

exports.deleteDictionary = dictId => {
    return { type: exports.DELETE_DICTIONARY, dictId };
};

exports.updateDictionary = (dictId, name, entryKeys) => {
    return { type: exports.UPDATE_DICTIONARY, dictId, name, entryKeys };
};

exports.startDictionaryDeletion = (dictId, name) => {
    return { type: exports.START_DICTIONARY_ADDITION, dictId, name };
};

exports.addEntry = (dictId, newEntry) => {
    return Object.assign({}, newEntry, {
        type: exports.ADD_ENTRY,
        dictId
    });
};

exports.updateEntry = (dictId, newEntry) => {
    return Object.assign({}, newEntry, {
        type: exports.UPDATE_ENTRY,
        dictId
    });
};

exports.deleteEntry = (dictId, entryId) => {
    return { type: exports.DELETE_ENTRY, dictId, entryId };
};

exports.startEntryDeletion = (dictId, entryId) => {
    return { type: exports.START_ENTRY_DELETION, dictId, entryId };
};

exports.startEntryEditing = (dictId, entryId) => {
    return { type: exports.START_ENTRY_EDITING, dictId, entryId };
};

exports.trainingNextEntry = (prevEntryId, nextEntryId, shouldIncrement) => {
    return { type: exports.TRAINING_NEXT_ENTRY, prevEntryId, nextEntryId, shouldIncrement };
};

exports.trainingShowHint = () => {
    return { type: exports.TRAINING_SHOW_HINT };
}; 


exports.navDictionaries = () => {
    return { type: exports.NAV_DICTIONARIES };
};

exports.navDictionary = dictId => {
    if (typeof dictId !== 'string')
        throw new Error('non-string dictId');
    return { type: exports.NAV_DICTIONARY, dictId };
};

exports.navNewDictionary = () => {
    return { type: exports.NAV_NEW_DICTIONARY };
};

exports.navEditDictionary = dictId => {
    return { type: exports.NAV_EDIT_DICTIONARY, dictId };
};

exports.navNewEntry = () => {
    return { type: exports.NAV_NEW_ENTRY };
};

exports.navTraining = () => {
    return { type: exports.NAV_TRAINING };
};

exports.navPage = pageNum => {
    return { type: exports.NAV_PAGE, pageNum };
};

exports.loginOk = userName=>{
    if (typeof userName === 'undefined')
        throw new Error('userName is required');
    return { type: exports.LOGIN_OK, userName };
};

exports.logout = () => {
    return { type: exports.LOGOUT };
};

exports.loginErr = errorMsg=>{
    if (typeof errorMsg === 'undefined')
        throw new Error('errorMsg is required');
    return { type: exports.LOGIN_ERR, errorMsg };
};

exports.signupErr = errorMsg=>{
    if (typeof errorMsg === 'undefined')
        throw new Error('errorMsg is required');
    return { type: exports.SIGNUP_ERR, errorMsg };
};