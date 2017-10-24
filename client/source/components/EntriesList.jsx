import PropTypes from 'prop-types';
import React from 'react';

import EntriesListRow from './EntriesListRow.jsx';


class EntriesList extends React.Component {
	
    render(){
        
        if (this.props.entries.length === 0)
            return <div>Dictionary is empty</div>;

        let trWidth = Math.floor(100 / (this.props.entryKeys.length + 1));

        return <div style={{
            borderTop: '1px solid lightgray',
            height: '90%',
            overflowY: 'scroll'
        }}>
            <table className="table">
                <thead>
                    <tr>
                        {
                            this.props.entryKeys.map((entryKey, index)=>{
                                return <th key={index}
                                    style={{
                                        width: trWidth + '%'
                                    }}
                                >
                                    {entryKey}
                                </th>;
                            })
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this.props.entries.map((entry, index)=>{
                            return <EntriesListRow
                                key={index}
                                entry={entry}
                                entryKeys={this.props.entryKeys}
                                onEdit={this.props.onEditEntry}
                                onUpdate={this.props.onUpdateEntry}
                                onDelete={this.props.onDeleteEntry}
                            />; 
                        })

                    }
                </tbody>
            </table>
        </div>;
    }
}

EntriesList.propTypes = {
    entryKeys: PropTypes.array.isRequired,
    entries: PropTypes.array.isRequired,
    onEditEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    onDeleteEntry: PropTypes.func.isRequired
};

export default EntriesList;