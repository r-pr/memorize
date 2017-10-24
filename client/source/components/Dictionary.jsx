import PropTypes from 'prop-types';
import React from 'react';

import EntriesList from './EntriesList.jsx';


class Dictionary extends React.Component {
    render(){
        return <div className="col-sm-12" style={{ height: '84vh' }}>

            <EntriesList 
                entries={this.props.entries}
                entryKeys={this.props.entryKeys}
                onAddEntry={this.props.onAddEntry}
                onEditEntry={this.props.onEditEntry}
                onUpdateEntry={this.props.onUpdateEntry}
                onDeleteEntry={this.props.onDeleteEntry}
            />

            <div className="row" style={{marginTop: '1em'}}>
                <div className="col-xs-6 col-sm-4" style={{marginBottom: '1em'}}>
                    <button 
                        className="btn btn-primary btn-block"
                        onClick={this.props.onAddEntry}
                    >
                    Add entry
                    </button>
                </div>
                <div className="col-xs-6 col-sm-4" style={{marginBottom: '1em'}}>
                    <button className="btn btn-success btn-block"
                        onClick={this.props.gotoTraining}
                    >
                        Start training
                    </button>
                </div>
                <div className="col-xs-6 col-sm-4" style={{marginBottom: '1em'}}>
                    <button className="btn btn-danger btn-block"
                        onClick={()=>{
                            if (confirm('Do you really want to delete this dictionary?')){
                                this.props.onDeleteDictionary(this.props.dictId);
                            }  
                        }}
                    >
                        Delete dictionary
                    </button>
                </div>
            </div>
        </div>;
    }
}

Dictionary.propTypes = {
    dictId: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    entryKeys: PropTypes.array.isRequired,
    gotoDictionaries: PropTypes.func.isRequired,
    gotoTraining: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onEditEntry: PropTypes.func.isRequired,
    onDeleteEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    onDeleteDictionary: PropTypes.func.isRequired
};

export default Dictionary;