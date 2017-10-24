import PropTypes from 'prop-types';
import React from 'react';

export default class EntriesListRow extends React.Component {

    componentDidMount(){
        let state = {};
        this.props.entryKeys.forEach(entryKey=>{
            state[entryKey] = this.props.entry[entryKey];
        });
        this.setState(state);
    }

    onEntryKeyChange(entryKey, val){
        this.setState( {[entryKey]: val} );
    }

    entryKeyTableCell(entryKey, index){
        return <td key={index}>
            {this.props.entry[entryKey]}
        </td>;
    }

    entryKeyInput(entryKey, index){
        return <td key={index}>
            <input
                type="text"
                value={this.state[entryKey]}
                onChange={e=>{
                    this.onEntryKeyChange(entryKey, e.target.value);
                }}
            />
        </td>;
    }

    editEntryButton(){
        return <button className="btn btn-default" style={{float: 'right'}}
            onClick={
                this.props.onEdit.bind(null, this.props.entry.dictId, this.props.entry._id)
            }
        >
            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </button>;
    }

    saveEntryButton(){
        return <button className="btn btn-default" style={{float: 'right'}}
            onClick={()=>{
                let newEntry = Object.assign({}, this.state, {
                    _id: this.props.entry._id
                });
                this.props.onUpdate(newEntry);
            }}
        >
            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
        </button>;
    }
	
    render(){
        let entry = this.props.entry;

        return <tr>
            {
                this.props.entryKeys.map((entryKey, index)=>{
                    return (this.props.entry.editing) ?
                        this.entryKeyInput(entryKey, index)
                        :
                        this.entryKeyTableCell(entryKey, index);                        
                })
            }
            <td>
                <button className="btn btn-default" 
                    onClick={()=>{
                        if (confirm('Do you really want to delete this entry?')){
                            this.props.onDelete(entry._id);
                        }
                    }}
                    style={{marginLeft: '1em', float: 'right'}}
                >
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                {
                    this.props.entry.editing ? this.saveEntryButton() : this.editEntryButton()
                }

            </td>
        </tr>;
    }

}

EntriesListRow.propTypes = {
    entry: PropTypes.object.isRequired,
    entryKeys: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};