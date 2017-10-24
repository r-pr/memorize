var a = require('./actions');
var deepFreeze = require('deep-freeze');

const initialState = {
    settings: {
        entriesPerPage: 10
    },
    navigation: {
        section: a.NavPositions.MAIN_PAGE
    },
    training: {},
    dictionaries: {}
};

function navigate(state = initialState.navigation, action) {
    switch (action.type) {
    case a.NAV_MAIN_PAGE:
        return { section: a.NavPositions.MAIN_PAGE };
    case a.ADD_DICTIONARY:
    case a.NAV_DICTIONARIES:
        return { section: a.NavPositions.DICTIONARIES };
    case a.NAV_DICTIONARY:
        return Object.assign({}, state, {
            section: a.NavPositions.DICTIONARY,
            dictId: action.dictId,
            pageNum: 1
        });
    case a.NAV_NEW_DICTIONARY:
        return Object.assign({}, state, {
            section: a.NavPositions.NEW_DICTIONARY
        });
    case a.NAV_EDIT_DICTIONARY:
        return Object.assign({}, state, {
            section: a.NavPositions.EDIT_DICTIONARY,
            dictId: action.dictId,
            pageNum: 1
        });
    case a.NAV_NEW_ENTRY:
        return Object.assign({}, state, {
            section: a.NavPositions.NEW_ENTRY
        });
    case a.NAV_TRAINING:
        return Object.assign({}, state, {
            section: a.NavPositions.TRAINING
        });
    case a.NAV_PAGE:
        return Object.assign({}, state, {
            pageNum: action.pageNum
        });
    case a.DELETE_DICTIONARY:
        return { section: a.NavPositions.DICTIONARIES };
    case a.LOGIN_OK:
        return { section: a.NavPositions.DICTIONARIES };
    case a.LOGIN_ERR:
    case a.SIGNUP_ERR:
        return { section: a.NavPositions.MAIN_PAGE };
    case a.LOGOUT:
        return { section: a.NavPositions.MAIN_PAGE };
    default:
        return state;
    }
}

function dictionaries(state = initialState, action) {
    switch (action.type) {
    case a.ERROR:
        return Object.assign({}, state, {
            errorMsg: action.errorMsg
        });
    case a.RECEIVE_DICTIONARIES:{
        return Object.assign({}, state, {
            dictionaries: action.dictionaries
        });
    }
    case a.RECEIVE_ENTRIES: {
        //if state has no dictionaries
        if (typeof state.dictionaries === 'undefined'){
            return Object.assign({}, state, {
                dictionaries: {
                    [action.dictId]: {
                        entries: action.entries
                    }
                }
            });
        }
        //if state has ho given dict
        if (typeof state.dictionaries[action.dictId] === 'undefined'){
            return Object.assign({}, state, {
                dictionaries: Object.assign({}, state.dictionaries, {
                    [action.dictId]: {
                        entries: action.entries
                    }
                })
            });
        }
        //if state has given dict
        return Object.assign({}, state, {
            dictionaries: Object.assign({}, state.dictionaries, {
                [action.dictId]: Object.assign({}, state.dictionaries[action.dictId], {
                    entries: action.entries
                })
            })
        });

    }
    case a.ADD_DICTIONARY:
        action.dict.entries = [];
        return Object.assign({}, state, {
            dictionaries: Object.assign({}, state.dictionaries, {
                [action.dictId]: action.dict
            })
        });
    case a.DELETE_DICTIONARY:
    {
        let newDicts = Object.assign({}, state.dictionaries);
        delete newDicts[action.dictId];
        var result =  Object.assign({}, state, {
            dictionaries: newDicts,
            navigation: {
                section: 'DICTIONARIES'
            }
        });
        return result;
    }
    case a.UPDATE_DICTIONARY:
    {
        let newDicts = JSON.parse(JSON.stringify(state.dictionaries));
        newDicts[action.dictId].name = action.name;
        newDicts[action.dictId].entryKeys = Object.assign({}, action.entryKeys);
        return Object.assign({}, state, {
            dictionaries: newDicts
        });
    }
    case a.ADD_ENTRY:
    {
        delete action.type;
        if (typeof action._id === 'undefined'){
            console.warn('no _id, assigning Date.now(). Action: ', action);
            action._id = Date.now().toString();
        }
        action.editing = false;
        let dictsCopy = JSON.parse(JSON.stringify(state.dictionaries));
        dictsCopy[action.dictId].entries.push(action);
        return Object.assign({}, state, {
            dictionaries: dictsCopy
        });
    }
    case a.UPDATE_ENTRY:
    {
        let dictsCopy = JSON.parse(JSON.stringify(state.dictionaries));
        dictsCopy[action.dictId].entries.forEach(function(entry){
            if (entry._id === action._id){
                delete action.dictId;
                delete action.type;
                delete action._id;
                for (let key in action){
                    entry[key] = action[key];
                }
                entry.editing = false;
            }
        });

        return Object.assign({}, state, {
            dictionaries: dictsCopy
        });

    }
    case a.START_ENTRY_EDITING:
    {
        let dictsCopy = JSON.parse(JSON.stringify(state.dictionaries));

        dictsCopy[action.dictId].entries.forEach(entry => {
            if (entry._id === action.entryId)
                entry.editing = true;
        });

        return Object.assign({}, state, {
            dictionaries: dictsCopy
        });
    }
    case a.DELETE_ENTRY:
    {
        let dictsCopy = JSON.parse(JSON.stringify(state.dictionaries));

        dictsCopy[action.dictId].entries = dictsCopy[action.dictId].entries.filter(entry => {
            return (entry._id == action.entryId) ? false : true;
        });

        return Object.assign({}, state, {
            dictionaries: dictsCopy
        });
    }
    case a.TRAINING_NEXT_ENTRY:
    {
        let dicts = state.dictionaries;
        let dictId = state.navigation.dictId;
        let dictEntries = dicts[dictId].entries;
        let entries = JSON.parse(JSON.stringify(dictEntries));
        
        for (let i = 0; i < entries.length; i++){
            if (entries[i]._id === action.prevEntryId){
                if (typeof entries[i].counter === 'undefined'){
                    entries[i].counter = 0;
                }
                if (action.shouldIncrement){
                    entries[i].counter++;
                }
                break;
            }
        }
     
        return Object.assign({}, state, {
            training: {
                entryId: action.nextEntryId,
                showHint: false
            },
            dictionaries: Object.assign({}, state.dictionaries, {
                [dictId]: Object.assign({}, state.dictionaries[dictId], {
                    entries: entries
                })
            })
        });

    }
    case a.TRAINING_SHOW_HINT:
        return Object.assign({}, state, {
            training: Object.assign({}, state.training, {
                showHint: true
            })
        });
    case a.NAV_TRAINING:
    {
        var toBeUpdated = {
            showHint: false
        };
        if (typeof state.training === 'undefined' || typeof state.training.entryId === 'undefined'){
            let dicts = state.dictionaries;
            let dictId = state.navigation.dictId;
            let minCounter = Infinity;
            let id = '';
            dicts[dictId].entries.forEach(entry=>{
                if (entry.counter < minCounter){
                    minCounter = entry.counter;
                    id = entry._id;
                }
            });
            toBeUpdated.entryId = id;
        }
        return Object.assign({}, state, {
            training: state.training ?  Object.assign({}, state.training, toBeUpdated) :
                toBeUpdated
        });
    }
    default:
        return state;
    }
}

function remote(state = initialState, action){
    switch(action.type){
    case a.LOGIN_OK:
        return Object.assign({}, state, {
            userName: action.userName,
            errorMsg: ''
        });
    case a.LOGIN_ERR:
    case a.SIGNUP_ERR:
        return Object.assign({}, state, {
            userName: '',
            errorMsg: action.errorMsg
        });
    case a.LOGOUT:
        return {
            dictionaries: {},
            userName: '',
            errorMsg: ''
        };
    default:
        return state;
    }
}

function rootReducer(state = initialState, action){
    deepFreeze(state);
    let newState = dictionaries(remote(state, action), action);
    newState = Object.assign({}, newState, {
        navigation: navigate(state.navigation, action)
    });
    return newState;
}

export default rootReducer;
