# Back-end #

Python (Flask), that uses MongoDB as a storage. Communication with frontend is done via RESTful HTTP requests.

## Collections ##

### dictionaries ###
```
{
    _id: <ObjectId>,
    name: "dict_name",
    user_id: <ObjectId>, //users._id
    entryKeys: {
        all: ['English', 'Russian', 'Transcription', 'Usage']
        training: ['English'], 
        hint: ['Russian', 'Usage'] //in this case 'Transcription' is currently unused
    }
}
```

### users ###
```
{
    _id: <ObjectId>,
    username: "John",
    password: "0xhash",
    salt: "0x5a17"
}
```

### entries ###
```
{
    _id: <ObjectId>,
    dict_id: <ObjectId>,
    English: "butterfly",
    Russian: "бабочка",
    Usage: "Бабочки порхают."
    counter: 2
}
```

## Main page ##

Authenticated user gets redirected to the Dictionaries page, non-authenticated user gets Main page. To render Dictionaries page only dictionaries' names and _ids are fetched from the server. Dictionary entries are fetched when the user navigates to the Dictionary Page. Entries are cached in the frontend app, so it doesn't fetch them every time the user switches between dictionaries.

## REST API ##

Every success response has code `200`. Every request can be potentially replied with error `500` and a conent of `{error: 'Interval server error'}`. For any CRUD operation user must provide a token (JWT) in `Authorization` header, which is obtained via `/login`.

### Signup ###

* URL `/signup`
* Method POST
* Data
  * username: 'foo'
  * password: 'baz'
* Succes response
  * Content: `{status: 'ok'}`
* Error response
  * Code: 400
  * Conent: `{error: 'login already used'}`

### Log in ###

* URL `/login`
* Method POST
* Data
  * username: 'foo'
  * password: 'bar'
* Success response
  * Content: `{status: 'ok', token: 'foo'}`
* Error response
  * Code: 401
  * Content: `{error: 'wrong password'}`

### Get dictionaries ###

* URL `/dictionaries`
* Method GET
* Success response
  * Content:
  ```
  {
    status: 'ok',
    dictionaries: [{
      '_id': '59ce4b6a80954896cb0e548e', 
      'name': 'test', 
      'entryKeys': {
        'all': ['eng', 'rus'], 
        'training': ['eng'], 
        'hint': ['rus']
      }
    }]
  }
  ```
* Error response
  * Code: 401
  * Content: `{error: 'Unauthorized'}`

### Create dictionary ###

* URL `/dictionaries/<dictionaryName>`
* Method POST
* Data
  * ent_all
  * ent_training
  * ent_hint
* Success response
  * Content: `{status: 'ok', _id: '01de45a3'}`
* Error response
  * Code: 409
  * Content: `{error: 'dictionary already exists'}`

### Get dictionary entries ###

* URL `/dictionaries/<dictionaryId>`
* Method GET
* Success response
  * Content:
  ```
  {
    status: 'ok',
    entries: [{
        _id: '76b8ae2',
        English: "butterfly",
        Russian: "бабочка",
        Usage: "Бабочки порхают."
        counter: 2
    },{
        /* ... */
    }]
  }
  ```
* Error response
  * Code: 404
  * Conent: `{error: 'dictionary not found'}`

  OR

  * Code: 401
  * Content: `{error: 'invalid token'}`

### Update dictionary ###

* URL `/dictionaries/<dictionaryId>`
* Method PUT
* Data 
  ```
  {
    name: 'New name', 
    entryKeys: {
      all: ['English', 'Russian', 'Transcription', 'Usage']
      training: ['English'], 
      hint: ['Russian', 'Usage', 'Transcription'] //start using 'Transcription'
    }
  }
  ```
* Succes response
  * Content: `{status: 'ok'}`
* Error response
* Code: 404
  * Conent: `{error: 'dictionary not found'}`

  OR

  * Code: 401
  * Content: `{error: 'invalid token'}`

  OR

  * Code: 400
  * Content: `{error: 'name is required'}`

### Delete dictionary ###

* URL `/dictionaries/<dictionaryId>`
* Method DELETE
* Succes response
  * Content: `{status: 'ok'}`
* Error response
  * Code: 404
  * Conent: `{error: 'dictionary not found'}`

  OR

  * Code: 401
  * Content: `{error: 'invalid token'}`

### Add entry ###

* URL `/dictionaries/<dictionaryId>/entries`
* Method POST
* Data `{ Spanish: 'Mariposa', English: 'Butterfly' }`
* Succes response
  * Content: `{status: 'ok', _id: '01de45a3'}`
* Error response
  * Code: 400
  * Content: `{error: 'dictionary not found'}`

  OR

  * Code: 401
  * Content: `{error: 'invalid token'}`

### Update entry ###

* URL `/dictionaries/<dictionaryId>/entries/<entryId>`
* Method PUT
* Data `{Spanish: 'Mariposa' }` (update filed 1) or `counter: 12` (update counter)
* Success response
  * Content: `{status: 'ok'}`
* Error response
  * Code: 400
  * Content: `{error: 'Unknown key'}`

  OR

  * Code: 401
  * Content: `{error: 'Unauthorized'}`

### Delete entry ###

* URL `/dictionaries/<dictionaryId>/entries/<entryId>`
* Method DELETE
* Success response
  * Content: `{status: 'ok'}`
* Error response
  * Code: 401
  * Content: `{error: 'Unauthorized'}`

# Front-end #

React.js + Redux.