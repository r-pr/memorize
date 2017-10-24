import React from 'react';
import PropTypes from 'prop-types';

class NewDictionary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dictName: 'New Dictionary',
            keySelectedForAssignment: '',
            keys: [{
                name: 'word',
                showOn: 'training'
            }, {
                name: 'translation',
                showOn: 'hint'
            }],
            errorMsg: props.errorMsg || ''
        };
    }

    componentWillReceiveProps(nextProps){
        console.log('nextError:', nextProps.errorMsg)
        if (nextProps.errorMsg !== this.state.errorMsg){
            this.setState({errorMsg: nextProps.errorMsg });
        }
    }

    onDictNameChange(e){
        this.setState({ dictName: e.target.value });
    }

    /**
         * Text change in the input of key name in the "Keys" panel.
         */
    onKeyNameChange(keyIndex, newText) {
        let keys = this.state.keys.slice();
        keys[keyIndex].name = newText;
        this.setState({ keys });
    }

    /**
         * Click on cross in the "Keys" panel.
         */
    onRemoveKeyClick(keyIndex) {
        let keys = this.state.keys.filter((k, index) => {
            return (keyIndex == index) ? false : true;
        });
        this.setState({ keys });
    }

    /**
         * Click on "Add" button in "Keys" panel.
         */
    onAddKeyClick() {
        let keys = this.state.keys.slice();
        keys.push({
            name: '',
            showOn: 'training'
        });
        this.setState({ keys });
    }

    /**
         * Mark key with a given name to be shown in training.
         */
    assignKey(keyName, role) {
        if (role !== 'training' && role !== 'hint')
            throw new Error('unknown role');
        let keys = this.state.keys.slice();
        keys.forEach(key => {
            if (key.name == keyName)
                key.showOn = role;
        });
        this.setState({
            keys
        });
    }

    onAddDictionaryClick(){
        //check if dict with this name already exists
        for (let i = 0; i < this.props.dictNames.length; i++){
            if (this.props.dictNames[i] === this.state.dictName){
                return this.setState({
                    errorMsg: `Dictionary "${this.state.dictName}" already exists. Choose another name.` 
                });
            }
        }
        let n_training = 0;
        let n_hint = 0;
        //check correctness of dict keys
        for (let i = 0; i < this.state.keys.length; i++){
            if (this.state.keys[i].name === ''){
                return this.setState({
                    errorMsg: 'All key names must not be blank.'
                });
            }
            if (this.state.keys[i].name === 'counter'){
                return this.setState({
                    errorMsg: 'Key "counter" is reserved for the application.'
                });
            }
            for (let j = i+1; j < this.state.keys.length; j++){
                if (this.state.keys[i].name === this.state.keys[j].name){
                    return this.setState({
                        errorMsg: 'All key names must be unique.'
                    });
                }
            }
            if (this.state.keys[i].showOn === 'hint'){
                n_hint++;
            } else if (this.state.keys[i].showOn === 'training'){
                n_training++;
            }
        }
        if (n_training === 0){
            return this.setState({
                errorMsg: 'At least one key must be shown in training.'
            });
        }
        if (n_hint === 0){
            return this.setState({
                errorMsg: 'At least one key must serve as a hint.'
            });
        }
        let dict = {
            name: this.state.dictName,
            entryKeys:{
                all: this.state.keys.map(key=>key.name),
                training: this.state.keys
                    .filter(key=>(key.showOn === 'training'))
                    .map(key=>key.name),
                hint: this.state.keys 
                    .filter(key=>(key.showOn === 'hint'))
                    .map(key=>key.name)
            },
            entries: []
        };
        this.props.onAddDictionary(dict);
    }

    render() {
        return (<div className="col-md-8">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Dictionary name</h3>
                </div>
                <div className="panel-body">
                    <form className="form">
                        <div className="form-group">
                            <input 
                                type="text" className="form-control"
                                value = {this.state.dictName}
                                onChange = {this.onDictNameChange.bind(this)} 
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Dictionary keys</h3>
                </div>
                <div className="panel-body">
                    {
                        this.state.keys.map((key, index)=>{
                            return (
                                <div key={index} className="row">
                                    <div className="col-xs-6"> 
                                        <div className="input-group" style={{marginBottom: '0.5em'}}>
                                            <input type="text" className="form-control"  
                                                value={key.name}
                                                onChange={ (e)=>{ 
                                                    this.onKeyNameChange(index, e.target.value); 
                                                }}
                                            />
                                            <span className="input-group-btn">
                                                <button className="btn btn-default" type="button"
                                                    onClick={this.onRemoveKeyClick.bind(this, index)}
                                                    disabled={this.state.keys.length <= 2}
                                                >
                                                    <span className="glyphicon glyphicon-remove" 
                                                        aria-hidden="true">
                                                    </span>
                                                </button>
                                            </span>
                                        </div>
                                    </div> 
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <div>
                                                <select 
                                                    className="form-control"
                                                    defaultValue={key.showOn}
                                                    onChange={(e)=>{
                                                        this.assignKey(key.name, e.target.value);
                                                    }}
                                                >
                                                    <option value="training">Show in training</option>
                                                    <option value="hint">Show as a hint</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>);
                        })
                    }
                    <div className="row"><div className="col-xs-6">
                        <button className="btn btn-default btn-block" 
                            onClick={this.onAddKeyClick.bind(this)}
                        >
                            Add new key
                        </button>
                    </div></div>
                </div>
            </div>
            <div className="alert alert-danger alert-dismissible" role="alert"
                style={{
                    display: this.state.errorMsg === '' ? 'none' : 'block'
                }}
            >
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                    onClick={()=>{
                        this.props.onErrorSeen();
                        this.setState({errorMsg: ''});
                    }}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                {this.state.errorMsg}
            </div>
            <div className="col-xs-6">
                <button 
                    className="btn btn-primary btn-block"
                    onClick={()=>{
                        this.onAddDictionaryClick();  
                    }}
                    disabled={(this.state.dictName === '')}
                >
                Create dictionary   
                </button>
            </div>
            <div className="col-xs-6">
                <button className="btn btn-danger btn-block"
                    onClick={this.props.gotoDictionaries}
                >
                Cancel
                </button>
            </div>


        </div>);
    }
}

NewDictionary.propTypes = {
    gotoDictionaries: PropTypes.func.isRequired,
    onAddDictionary: PropTypes.func.isRequired
    ,dictNames: PropTypes.array.isRequired //names of all dicts in the app
    ,errorMsg: PropTypes.string
    ,onErrorSeen: PropTypes.func.isRequired
};

export default NewDictionary;
