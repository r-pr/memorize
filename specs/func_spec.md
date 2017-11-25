# Overview #

__Note: throughout this document, "he" means "he or she".__

Mnesis is a web service that helps people to memorize new information that can be represented as a group of key-value pairs. For example, a person studying foreign language can add a couple of words and their translations to a list and then ask Mnesis to repeatedly require him to translate words in the list. If one knows the translation, he goes to the next word in the list; if not, he is presented with the translation to refresh one's memory. Other use-cases are also possible (see below).

# Details #

The key elements in the app are so called _dictionary entries_, which are groupped into _dictionaries_. A dictionary entry is a list of key-value pairs, which represent a thing that the user wants to memorize. For example, a user that learns English may create an entry with two keys, `<native word>` and `<foreing word>`, and values of `'mariposa'` and `'butterfly'` respectively. A medical student can make use of entries like `<lab name>:<reference range>` (e.g. `'normal blood glucose level':'4-5 mmol/L'`).  More than two keys may be added to an entry, for example to associate with a foreing word its phonetic transcription or usage.

## Page by page spec ##

Notes: 
* click on `[[Logout]]` button logs a user out and redirects him to the main page;
* click on `/Logo/` image redirects the user to the main page;
* maximum string length of user input is 500 characters;
* user input cannot be blank;
* dictionary names can only contain alphanumeric characters.

### Main page ###

Main page looks like this:
```
_____________________________________________________________
/Logo/                                                                  

	Welcome to Mnesis, the service that can help you memorize 
    foreing words or other things. 
	
	Log in with:
	[Icons of social networks]
_____________________________________________________________
```

After successfull login the user is taken to the Dictionaries page.

### Dictionaries ###
```
_______________________________________________________________
/Logo/                                     User name [[Logout]]

                       Dictionaries

                    	/Foods/          	
                    	/Places/    

                    	[[Create new]]
_______________________________________________________________
```
When the user clicks on a dictionary name, he goes to the Dictionary page.  Click on `[[Create new]]` redirects the user to the New Dictionary page.

### New Dictionary ###
```
_______________________________________________________________
/Logo/                                     User name [[Logout]]
        /Dictionaries/ -> New

        Name: [Russian. Foods]

        Keys:
            [Russian]
            [Transcription]
            [English]
            [Usage]
            [[Add]]

        Keys to be shown during training:
            Russian
            Transcription
            [[Add]]

        Hint keys:
            English
            Usage

        [[Save dictionary]]
_______________________________________________________________
```
On this page, the user can specify
* dictionary name;
* keys that should be present in each dictionary entry;
* what keys should appear during the training, and
* what keys should be shown when the users asks for hint.

When the user first gets to the page, the following defaults are present:
* `Name` field contains text `New Dictionary`;
* `Keys` section containts two inputs with text `Key1` and `Key2`;
* `Keys to be shown during training` contains one element with the name of key #1;
* `Hint keys` contains one element with the name of key #2.

The user can add no more than 5 keys to a dictionary entry, or create keys with the same name.

Dictionary name or key name cannot have a length bigger than 50 characters.

The user cannot add a key to the `show during training` section, if it's already in `hint keys` section and vice versa.

### Dictionary ###

On this page the user can browse contents of a dictionary, add, delete and update dictionary entries.

The page looks like this:
```
________________________________________________________________________
/Logo/                                         User name [[Logout]]
                
                /Dictionaries/ -> Russian. Foods [edit icon]                          
                
                [[Start training]]

                Contents (28 entries):
    ---------------------------------------------------------------------+
    Russian   | Transcription | English  | Usage            |            |
    ----------+---------------+----------+------------------+------------|
    картошка  | kartoshka     | potato   | Картошка полезна | [[edit]]   |
              |               |          | для здоровья.    | [[delete]] |
    ----------+---------------+----------+------------------+------------| 
    [морковь] | [markov'    ] | [carrot] | [              ] | [[save]]   |
    ---------------------------------------------------------------------+
                       [<] [1][2] ... [9] [>]                           
                       ----------------------
                            [[Add entry]] 
                     
__________________________________________________________________________
```
Click on `[[Start training]]` button redirects the user to the Training Page, `/edit icon/` to the Edit Dictionary page, and `[[add entry]]` to the New Entry page. 

"Contents" section shows dictionary entries in a tabular form.  When the user clicks `[[edit]]` button, cells of the respective row turn into editable fields like textareas, and the button text is changed from "edit" into "save". `[[save]]` button updates dictionary with changes made by the user and refreshes Contents section. `[[delete]]` button removes an entry from the dictionary and refreshes the page.

#### Pagination ####

By default the last page is shown. Each page contains 10 entries. Pagination is recalculated after every change of the number of entries, so that after adding a new one the user should be on a page with the newly added entry.

### New Entry ###

```
________________________________________________________________________
/Logo/                                         User name [[Logout]]
                
                /Dictionaries/ -> /Russian. Foods/ -> New entry

                Russian        [           ]
                Transcription  [           ]
                English	       [           ]
                Usage          [           ]

                [[Add]] [[Cancel]]                         
                                   
__________________________________________________________________________
```

On this page user gets a list of inputs for every key that he specified on the New Dictionary page. Click on `[[Add]]` button inserts an entry into dictionary and gets user back to the dictionary. `[[Cancel]]` button returns the user to the dictionary.

### Edit Dictionary ###

The page looks like New Dictionary, but without an option of creating or deleting keys of dictionary entries.

```
_______________________________________________________________
/Logo/                                     User name [[Logout]]
        /Dictionaries/ -> Russian. Foods

        Name: [Russian. Foods]

        Keys to be shown during training:
            Russian
            Transcription

        Hint keys:
            English
            Usage

        [[Update dictionary]]
        [[Delete dictionary]]
_______________________________________________________________
```

On this page the user can change a dictionary name or change the order of appearance of entry keys. `[[Update dictionary]]` button saves changes. Click on `[[Delete dictionary]]` triggers confirmation dialog box, and, if the user confirms, deletes the dictionary and redirects the user to the Dictionaries page.

### Training ###
```
____________________________________________________________________
[Logo]                                            User name [Logout]
		
                	[Dictionaries] -> Russian. Foods
                                                              
                    Картошка
                    kartoshka

                    [I know it]
                    [Show hint]
                     
_____________________________________________________________________
```
On this page some of a dictionary entry keys (specified by the user on New Dictionary page) are shown to him. If he knows the answer he clicks `[I know it]` and kyes of the next entry become displayed. If the user cannot remember, he clicks `[Show hint]`, which displays other keys of an entry. The system keeps a counter for every entry, which gets incremented when user clicks `[I know it]`. This counter is used to select the next word (one with the lowest counter gets selected).

# Non Goals #
This version will not support the following features:
* messages between users;
* public dictionaries (only private);
* multi-language interface (only English), but the app should be built in such a way that internationalization can be easily added in future versions.

This spec is written following the advices given [here](https://www.joelonsoftware.com/2000/10/02/painless-functional-specifications-part-1-why).

