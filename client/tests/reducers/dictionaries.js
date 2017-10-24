var expect = require('chai').expect;
import dictionaries from './../../source/reducers';
//var dictionaries = require('./../../source/reducers');
var a = require('./../../source/actions')

describe('dictionaries', () => {
    it('should correctly handle addDictionary', () => {
        let state = dictionaries({}, a.addDictionary('1e65', { foo: 'bar' }));
        expect(state.dictionaries).to.have.property('1e65');
        expect(state.dictionaries['1e65'].foo).to.equal('bar');
    });

    it('should correctly handle error', () => {
        let state = dictionaries({}, a.addDictionary('1e65', { foo: 'bar' }));
        state.navigation.section = 'DICTIONARIES';
        state = dictionaries(state, a.error('foo'));
        expect(state.navigation.section).to.equal('DICTIONARIES');
        expect(state.errorMsg).to.equal('foo');
    });

    it('should correctly handle receiveDictionaries', () => {
        let state = dictionaries({}, a.receiveDictionaries([1, 2, 3]));
        expect(state.dictionaries).to.deep.equal([1, 2, 3]);
    });

    it('should correctly handle receiveEntries', () => {
        let state = dictionaries({ dictionaries: { 'foo': {} } }, a.receiveEntries('foo', [1, 2, 3]));
        expect(state.dictionaries.foo).to.have.property('entries');
        expect(state.dictionaries.foo.entries).to.deep.equal([1, 2, 3]);
    });

    it('should correctly handle deleteDictionary', () => {
        let state = {
            dictionaries: {
                '01ea67': {
                    name: 'dict1'
                },
                '01ea68': {
                    name: 'dict2'
                }
            }
        }
        state = dictionaries(state, a.deleteDictionary('01ea67'));
        expect(state.dictionaries).not.to.have.property('01ea67')
    });
    it('should correctly handle updateDictionary', () => {
        let state = {
            dictionaries: {
                '01ea68': {
                    name: 'dict1',
                    entryKeys: {
                        foo: 'bar'
                    }
                }
            }
        }
        state = dictionaries(state, a.updateDictionary('01ea68', '3dict', {
            bar: 'baz'
        }));
        expect(state.dictionaries['01ea68'].name).to.equal('3dict');
        expect(state.dictionaries['01ea68'].entryKeys).to.not.have.property('foo')
        expect(state.dictionaries['01ea68'].entryKeys.bar).to.equal('baz');
    });
    it('should correctly handle addEntry', () => {
        let state = {
            dictionaries: {
                '01ea68': {
                    name: 'dict1',
                    entryKeys: {
                        all: ['foo']
                    },
                    entries: []
                }
            }
        }
        state = dictionaries(state, a.addEntry('01ea68', { foo: 'bar', _id: '9f' }));
        expect(state.dictionaries['01ea68'].entries.length).to.equal(1);
        expect(state.dictionaries['01ea68'].entries[0]._id).to.equal('9f');
        expect(state.dictionaries['01ea68'].entries[0].foo).to.equal('bar');
        expect(state.dictionaries['01ea68'].entries[0].editing).to.equal(false);
    });

    it('should correctly handle updateEntry', () => {
        let state = {
            dictionaries: {
                '01ea68': {
                    name: 'dict1',
                    entryKeys: {
                        all: ['foo']
                    },
                    entries: [{
                        _id: 'bloop',
                        foo: 'bar'
                    }]
                }
            }
        }
        state = dictionaries(state, a.updateEntry('01ea68', { foo: 'baz', _id: 'bloop' }));
        expect(state.dictionaries['01ea68'].entries.length).to.equal(1);
        expect(state.dictionaries['01ea68'].entries[0].foo).to.equal('baz');
        expect(state.dictionaries['01ea68'].entries[0].editing).to.equal(false);
    });

    it('should correctly handle startEntryEditing', () => {
        let state = {
            dictionaries: {
                '01ea68': {
                    name: 'dict1',
                    entryKeys: {
                        all: ['foo']
                    },
                    entries: [{
                        _id: 'bloop',
                        foo: 'bar'
                    }]
                }
            }
        }
        state = dictionaries(state, a.startEntryEditing('01ea68', 'bloop'));
        expect(state.dictionaries['01ea68'].entries[0].editing).to.equal(true);
    });

    it('should correctly handle deleteEntry', () => {
        let state = {
            training: {
                entryId: '45e338ba',
                showHint: false
            },
            dictionaries: {
                '01ea68': {
                    name: 'dict1',
                    entryKeys: {
                        all: ['foo']
                    },
                    entries: [{
                        _id: 'bloop',
                        foo: 'bar'
                    }]
                }
            }
        }
        state = dictionaries(state, a.deleteEntry('01ea68', 'bloop'));
        expect(state.dictionaries['01ea68'].entries.length).to.equal(0);
    });

    describe('training', () => {
        describe('trainingNextEntry', () => {
            // it('should correctly place in state.training id of entry with the smallest counter', () => {
            //     let state = {
            //      navigation: {
            //          dictId: '01ea68'
            //      },
            //         training: {
            //             entryId: '45e338ba',
            //             showHint: true
            //         },
            //         dictionaries: {
            //             '01ea68': {
            //                 name: 'dict1',
            //                 entryKeys: {
            //                     all: ['foo']
            //                 },
            //                 entries: [{
            //                     _id: 'bloop',
            //                     foo: 'bar'
            //                 }]
            //             }
            //         }
            //     }
            //     state = dictionaries(state, a.trainingNextEntry());
            //     expect(state.training.entryId).to.equal('bloop');
            //     expect(state.training.showHint).to.equal(false);
            // })
            // it('should increment counter of entry in dictionary', ()=>{
            //  let state = {
            //      navigation: {
            //          dictId: '01ea68'
            //      },
            //         training: {
            //             entryId: '45e338ba',
            //             showHint: true
            //         },
            //         dictionaries: {
            //             '01ea68': {
            //                 name: 'dict1',
            //                 entryKeys: {
            //                     all: ['foo']
            //                 },
            //                 entries: [{
            //                     _id: 'bloop',
            //                     foo: 'bar'
            //                 }]
            //             }
            //         }
            //     }
            //     state = dictionaries(state, a.trainingNextEntry());
            //     expect(state.dictionaries['01ea68'].entries[0].counter).to.equal(1);

            // });
            it('should behave correctly', () => {
                let state = {
                    navigation: {
                        dictId: 1
                    },
                    dictionaries: {
                        '1': {
                            entries: [{
                                _id: '2',
                                counter: 1
                            }, {
                                _id: '3'
                            }]
                        }
                    }
                }
                state = dictionaries(state, a.trainingNextEntry('2', '3'));
                expect(state.dictionaries['1'].entries[0].counter).to.equal(2);
                expect(state.training.entryId).to.equal('3');
            });
        })
        describe('trainingShowHint', () => {
            it('should set training.showHint to true', () => {
                let state = {
                    training: {
                        entryId: 'bar',
                        showHint: false
                    }
                }
                state = dictionaries(state, a.trainingShowHint());
                expect(state.training.showHint).to.be.true;
                expect(state.training.entryId).to.equal('bar');
            })
        })
    })

})

describe('navTraining', () => {
    it('should set training.entyId and training.showHint if they arent set', function() {
        let state = {
            training: {

            },
            navigation: {
                dictId: '1'
            },
            dictionaries: {
                '1': {
                    entries: [{
                        _id: '2',
                        counter: 1
                    },{
                        _id: '3',
                        counter: 0
                    }]
                }
            }
        };
        state = dictionaries(state, a.navTraining());
        expect(state.training.showHint).to.be.false;
        expect(state.training.entryId).to.equal('3');
    });
    it('should not change training.entyId if it is set', function() {
        let state = {
            training: {
                entryId: 'foo',
                showHint: true
            },
            navigation: {
                dictId: '1'
            },
            dictionaries: {
                '1': {
                    entries: [{
                        _id: '2',
                        counter: 1
                    },{
                        _id: '3',
                        counter: 0
                    }]
                }
            }
        };
        state = dictionaries(state, a.navTraining());
        expect(state.training.showHint).to.be.false;
        expect(state.training.entryId).to.equal('foo');
    })
})