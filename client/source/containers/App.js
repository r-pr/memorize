import { connect } from 'react-redux';
import React from 'react';

import Breadcrumbs from '../components/Breadcrumbs';
import Dictionaries from '../components/Dictionaries';
import Dictionary from '../components/Dictionary.jsx';
import Header from '../components/Header';
import NewDictionary from '../components/NewDictionary.jsx';
import NewEntry from '../components/NewEntry';
import Training from '../components/Training.jsx';
import MainPage from '../components/Main';

import {
    /* addDictionary, addEntry, updateEntry, deleteDictionary, deleteEntry,*/ 
    navDictionaries, 
    navDictionary, navTraining, navNewDictionary,
    navNewEntry,  startEntryEditing,  
    trainingNextEntry, trainingShowHint,  error
} from '../actions';

import { 
    login, signup, logout, addDictionary, deleteDictionary, fetchEntriesAndNavigate, 
    addEntry, updateEntry, deleteEntry
} from '../remote-actions';

// var store = {
//  userName: 'lorenzo',
//  errorMsg: '',
// 	settings: {
// 		entriesPerPage: 10
// 	},
// 	navigation: {
// 		section: 'DICTIONARIES', // or 'DICTIONARY', 'NEW_DICTIONARY', 'EDIT_DICTIONARY', 'NEW_ENTRY', 'TRAINING'
// 		dictId: '45e3e', //set if section != ('DICTIONARIES' || 'NEW_DICTIONARY'),
// 		pageNum: 1
// 	},
// 	training: {
// 		entryId: '45e338ba',
// 		showHint: false
// 	},
// 	dictionaries: {
// 		'01ea67': { //dict _id
// 			name: 'dict1',
// 			entryKeys: {
// 				all: ['English', 'Russian', 'Transcription', 'Usage'],
// 				training: ['English'], 
// 				hint: ['Russian', 'Usage'] //in this case 'Transcription' is currently unused
// 			}, 
// 			entries: [{
//   				_id:    '45e338ba',
//   				Russian: 'Бабочка',
//   				English: 'Butterfly',
//   				Usage: 'Бабочки порхают на лугу.',
//   				counter: 2,
//   				editing: false
// 			}]
// 		}
// 	}
// }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    clearError(){
        this.props.dispatch(error(''));
    }


    onAddDictionary(dict){
        this.props.dispatch(addDictionary(dict));
    }


    onDeleteDictionary(dictId){
        this.props.dispatch(deleteDictionary(dictId));
    }


    gotoDictionary(dictId){
        if (!dictId)
            throw new Error('no dict id');
        const { dispatch } = this.props;
        if (typeof this.props.dictionaries[dictId].entries === 'undefined'){
            dispatch(fetchEntriesAndNavigate(dictId));
        } else {
            dispatch(navDictionary(dictId));
        }
        
    }

    gotoDictionaries(){
        const { dispatch } = this.props;
        dispatch(navDictionaries());
    }

    gotoTraining(){
        const { dispatch } = this.props;
        dispatch(navTraining());
    }

    //Dictionary::save_entry button clicked
    onUpdateEntry(dictId, newEntry){
        console.log('gona update entry', dictId, newEntry);
        this.props.dispatch(updateEntry(dictId, newEntry));
    }

    //Dictionary::edit_entry button clicked
    onEditEntry(dictId, entryId){
        const { dispatch } = this.props;
        dispatch(startEntryEditing(dictId, entryId));
    }

    onAddEntry(dictId, entry){
        console.log(entry);
        const { dispatch } = this.props;
        dispatch(addEntry(dictId, entry));
    }

    
    onDeleteEntry(dictId, entryId){
        this.props.dispatch(deleteEntry(dictId, entryId));
    }

    gotoNewEntry(){  
        const { dispatch } = this.props;
        dispatch(navNewEntry());
    }


    //Dictionaries::create_new button clicked
    onCreateNewDict(){
        const { dispatch } = this.props;
        dispatch(navNewDictionary());
    }

    showNextEntry(entryId, shouldIncrement){
        
        // find next entry to display, increment counter in current entry

        //let len
        //if dict len is gte 10 set len to 10
        //otherwise set len to dict len
        //get from dictionary 10 entries with lowest counters
        //select random from that set
        //update dictionaries
        if (!this.props.navigation.dictId){
            throw new Error('no dictId in navigation');
        }
        let dictId = this.props.navigation.dictId;
        if (typeof this.props.dictionaries[dictId] === 'undefined'){
            throw new Error('dict ' + dictId + ' not found in dictionaries');
        }
        let dictEntries = this.props.dictionaries[dictId].entries;
        let currentEntry = null;
        for (let i = 0; i < dictEntries.length; i++){
            if (dictEntries[i]._id === entryId){
                currentEntry = JSON.parse(JSON.stringify(dictEntries[i]));
                break;
            }
        }
        let len = dictEntries.length >= 10 ? 10 : dictEntries.length;
        let entries = dictEntries.slice().sort((a, b)=>{
            return a.counter > b.counter ? 1 : b.counter < a.counter ? -1 : 0; 
        }).slice(0, len);
        let selectedEntry = entries[Math.floor(Math.random() * len)];

        //ensure that next entry is different from pervious
        while (len > 1  && selectedEntry._id === entryId){
            selectedEntry = entries[Math.floor(Math.random() * len)];
        }

        //increment counter in currentEntry and show next
        this.props.dispatch(trainingNextEntry(entryId, selectedEntry._id, shouldIncrement));

        if (typeof currentEntry.counter === 'undefined'){
            currentEntry.counter = 0;
        }
        currentEntry.counter++;

        //increment counter remotely if withoutHint
        if (shouldIncrement){
            this.props.dispatch(updateEntry(dictId, {_id: currentEntry._id, counter: currentEntry.counter }));
        }
        
    }

    needHint(){
        this.props.dispatch(trainingShowHint());
    }

    onLogIn(userName, password){
        this.props.dispatch(login(userName, password));
    }

    onLogout(){
        this.props.dispatch(logout());
    }

    onSignUp(userName, password){
        this.props.dispatch(signup(userName, password));
    }

    getActiveSection(){

        let currDictId = this.props.navigation.dictId;
        console.log('gas', this.props.navigation.section);
        switch(this.props.navigation.section){
        case 'DICTIONARIES':
            return <Dictionaries
                onCreateNew={this.onCreateNewDict.bind(this)}
                onDictClick={this.gotoDictionary.bind(this)}
                dictionaries={this.props.dictionaries}
            />;
        case 'NEW_DICTIONARY':
            return <NewDictionary
                onAddDictionary={this.onAddDictionary.bind(this)}
                dictNames={Object.keys(this.props.dictionaries).map(dictId=>{
                    return this.props.dictionaries[dictId].name;
                })}
                gotoDictionaries={this.gotoDictionaries.bind(this)}
                errorMsg={this.props.errorMsg}
                onErrorSeen={this.clearError.bind(this)}
            />;
        case 'DICTIONARY':
            return <Dictionary
                dictId={currDictId}
                gotoDictionaries={this.gotoDictionaries.bind(this)}
                gotoTraining={this.gotoTraining.bind(this)}
                onDeleteEntry={this.onDeleteEntry.bind(this, currDictId)}
                onDeleteDictionary={this.onDeleteDictionary.bind(this)}
                onEditEntry={this.onEditEntry.bind(this)}
                onUpdateEntry={this.onUpdateEntry.bind(this, currDictId)}
                onAddEntry={this.gotoNewEntry.bind(this)}
                name = {this.props.dictionaries[currDictId].name}
                entries = {this.props.dictionaries[currDictId].entries}
                entryKeys = {this.props.dictionaries[currDictId].entryKeys.all}
            />;
        case 'NEW_ENTRY':
            return <NewEntry
                entryKeys={this.props.dictionaries[currDictId].entryKeys.all}
                dictName = {this.props.dictionaries[currDictId].name}
                dictId = {currDictId}
                onDictClick = {this.gotoDictionary.bind(this, currDictId)}
                onAddEntry={this.onAddEntry.bind(this)}
                errorMsg={this.props.errorMsg}
                onErrorSeen={this.clearError.bind(this)}
            />;
        case 'TRAINING':
            return <Training
                entryId={this.props.training.entryId}
                shouldShowHint={this.props.training.showHint}
                dict={this.props.dictionaries[currDictId]}
                showNextEntry={this.showNextEntry.bind(this)}
                needHint={this.needHint.bind(this)}
                onCancel={()=>{
                    this.gotoDictionary(currDictId);
                }}
            />;
        case 'MAIN_PAGE':
            return <MainPage
                onLogIn={this.onLogIn.bind(this)}
                onSignUp={this.onSignUp.bind(this)}
                errorMsg={this.props.errorMsg}
            />;
        }
    }

    render(){
        console.log(this.props);
        let currDictName = '';
        if (this.props.navigation.dictId){
            currDictName = this.props.dictionaries[this.props.navigation.dictId].name;
        }

    	return <div className="container-fluid">
  			<Header
                userName={this.props.userName}
                onLogout={this.onLogout.bind(this)}
            />
            <Breadcrumbs
                gotoDictionaries={this.gotoDictionaries.bind(this)}
                gotoDictionary={this.gotoDictionary.bind(this)}
                navSection={this.props.navigation.section}
                navDictId={this.props.navigation.dictId}
                navDictName={currDictName}
            />
  			<div className="row">
                { this.getActiveSection() }
    		</div>
  		</div>;
    }
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(App);