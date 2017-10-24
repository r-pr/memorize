import {
    loginOk, loginErr, logout as _logout,
    addDictionary as _addDictionary,
    deleteDictionary as _deleteDictionary,
    addEntry as _addEntry,
    updateEntry as _updateEntry,
    deleteEntry as _deleteEntry,
    error,
    receiveDictionaries,  receiveEntries,
    navDictionary, navDictionaries
} from './actions';

import fetch from 'isomorphic-fetch';

const BASE_URL = window.location.href;
//const BASE_URL = 'http://mnezis.herokuapp.com/';

var token = '';


export function login(userName, password) {
    return dispatch => {
        fetch(BASE_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: 'username=' + encodeURIComponent(userName) + '&password=' + encodeURIComponent(password)
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return dispatch(loginErr(json.error));
                        } else {
                            token = json.token;
                            fetch(BASE_URL + 'dictionaries', {
                                method: 'GET',
                                headers: {
                                    'Authorization': token
                                }
                            })
                                .then(response => {
                                    response.json()
                                        .then(json => {
                                            if (response.status !== 200) {
                                                return dispatch(error(json.error));
                                            } else {
                                                let dicts = {};
                                                json.dictionaries.forEach(dict => {
                                                    dicts[dict._id] = dict;
                                                    delete dict._id;
                                                });
                                                fetchEntriesAndNavigate(Object.keys(dicts)[0]);
                                                dispatch(receiveDictionaries(dicts));
                                                return dispatch(loginOk(userName));
                                            }
                                        })
                                        .catch(e => {
                                            return dispatch(error(e.message));
                                        });
                                }, err => {
                                    return dispatch(error(err.message));
                                })
                                .catch(err => {
                                    return dispatch(loginErr(err.message));
                                });
                        }
                    })
                    .catch(e => {
                        return dispatch(loginErr(e.message));
                    });
            }, error => {
                return dispatch(loginErr(error.message));
            })
            .catch(error => {
                return dispatch(loginErr(error.message));
            });
    };
}

export function logout() {
    return dispatch => {
        dispatch(_logout());
    };
}

export function signup(userName, password) {
    return dispatch => {
        fetch(BASE_URL + 'signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: 'username=' + encodeURIComponent(userName) + '&password=' + encodeURIComponent(password)
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return dispatch(loginErr(json.error));
                        } else {
                            dispatch(login(userName, password));
                        }
                    })
                    .catch(e => {
                        return dispatch(loginErr(e.message));
                    });
            }, error => {
                return dispatch(loginErr(error.message));
            })
            .catch(error => {
                return dispatch(loginErr(error.message));
            });
    };
}

export function addDictionary(dict) {
    return dispatch => {
        fetch(BASE_URL + 'dictionaries/' + dict.name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': token
            },
            body: 'ent_all=' + encodeURIComponent(dict.entryKeys.all.join(',')) +
                '&ent_training=' + encodeURIComponent(dict.entryKeys.training.join(',')) +
                '&ent_hint=' + encodeURIComponent(dict.entryKeys.hint.join(','))
        })
            .then(response => {
                if (response.status === 500) {
                    return dispatch(error('500 - Internal Server Error'));
                }
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return dispatch(error(json.error));
                        } else {
                            return dispatch(_addDictionary(json._id, dict));
                        }
                    })
                    .catch(e => {
                        return dispatch(error(e.message));
                    });
            }, err => {
                return dispatch(error(err.message));
            })
            .catch(err => {
                return dispatch(error(err.message));
            });
    };

}

export function addEntry(dictId, newEntry){
    let body = '';
    Object.keys(newEntry).forEach(key=>{
        if (key === 'dictId'){
            return;
        }
        if (body !== ''){
            body += '&';
        }
        body += `${key}=${encodeURIComponent(newEntry[key])}`;
    });

    return dispatch=>{
        fetch(`${BASE_URL}dictionaries/${dictId}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': token
            },
            body
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return dispatch(error(json.error));
                        } else {
                            newEntry._id = json._id;
                            dispatch(_addEntry(dictId, newEntry));
                            return dispatch(navDictionary(dictId));
                        }
                    })
                    .catch(e => {
                        return dispatch(error(e.message));
                    });
            }, err => {
                return dispatch(error(err.message));
            })
            .catch(err => {
                return dispatch(error(err.message));
            });
    };
}

export function updateEntry(dictId, entry){
    let body = '';
    Object.keys(entry).forEach(key=>{
        if (key === '_id'){
            return;
        }
        if (body !== ''){
            body += '&';
        }
        body += `${key}=${encodeURIComponent(entry[key])}`;
    });
    return dispatch=>{
        fetch(`${BASE_URL}dictionaries/${dictId}/entries/${entry._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': token
            },
            body
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return console.warn(json.error);
                        } else {
                            return dispatch(_updateEntry(dictId, entry));
                        }
                    })
                    .catch(e => {
                        return console.warn(e.message);
                    });
            }, err => {
                return console.warn(err.message);
            })
            .catch(err => {
                return dispatch(err.message);
            });
    };
}

export function fetchEntriesAndNavigate(dictId) {
    return dispatch=>{
        fetch(`${BASE_URL}dictionaries/${dictId}/entries`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return dispatch(error(json.error));
                        } else {
                            // every entry needs dictId
                            json.entries.forEach(entry=>{
                                entry.dictId = dictId;
                            });
                            dispatch(receiveEntries(dictId, json.entries));
                            return dispatch(navDictionary(dictId));
                        }
                    })
                    .catch(e => {
                        return dispatch(error(e.message));
                    });
            }, err => {
                return dispatch(error(err.message));
            })
            .catch(err => {
                return dispatch(error(err.message));
            });
    };

}

export function deleteDictionary(dictId){
    return dispatch=>{
        fetch(`${BASE_URL}dictionaries/${dictId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            console.warn(json.error);
                            return dispatch(navDictionaries());
                        } else {
                            return dispatch(_deleteDictionary(dictId));
                        }
                    })
                    .catch(e => {
                        console.warn(e.message);
                        return dispatch(navDictionaries());
                    });
            }, err => {
                console.warn(err.message);
                return dispatch(navDictionaries());
            })
            .catch(err => {
                console.warn(err.message);
                return dispatch(navDictionaries());
            });
    };
}


export function deleteEntry(dictId, entryId){
    return dispatch=>{
        fetch(`${BASE_URL}dictionaries/${dictId}/entries/${entryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (response.status !== 200) {
                            return console.warn(json.error);
                        } else {
                            return dispatch(_deleteEntry(dictId, entryId));
                        }
                    })
                    .catch(e => {
                        return console.warn(e.message);
                    });
            }, err => {
                return console.warn(err.message);
            })
            .catch(err => {
                return console.warn(err.message);
            });
    };
}