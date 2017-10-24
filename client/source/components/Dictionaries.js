import PropTypes from 'prop-types'
import React from 'react'


class Dictionaries extends React.Component {


    render() {
        let dicts = [];
        for (let key in this.props.dictionaries) {
            dicts.push(<li key = {key}><a href="#" 
					onClick={()=>{this.props.onDictClick(key)}}
				>
					{this.props.dictionaries[key].name}
				</a>
			</li>);
        }

        return (<div>

				<div className="col-sm-12">
					{dicts.length > 0 ? <ul style={{lineHeight: '2em'}}>{dicts}</ul> : <p>You have no dictionaries yet.</p>}
				</div>

				<div className="col-sm-12">
				<button 
					className="btn btn-default"
					onClick={this.props.onCreateNew}
				>
					Create new
				</button>
				</div>

			
			
		</div>)
    }
}

Dictionaries.propTypes = {
    onCreateNew: PropTypes.func.isRequired,
    onDictClick: PropTypes.func.isRequired,
    dictionaries: PropTypes.object.isRequired
}

export default Dictionaries
