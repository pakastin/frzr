# frzr
Super simple MVC inspired by Riot.js 2.0

## install


    npm install frzr


  or [download from here](http://pakastin.github.io/frzr/dist/frzr.js)

## Why yet another MVC?
Frzr.js is different because:
- It's small, really small
- Collections are indexed, so queries are superfast!
- You can provide controllers to models themselves.
- Models/collections can be viewmodels / viewcollections or simple models/collections.
- Small learning curve: only models and collections!

## model(params)

Parameters:

- init: called when model is created
- update: called when model is updating
- updated: called when model is updated
- template: HTML template
- render: register 'render' listener
- rendered: register 'rendered' listener
- mount: register 'mount' listener
- unmount: register 'unmount' listener
- destroy: register 'destroy' listener

Attributes:
- set(key, value): set by key
- unset(key): unset by key
- reset(data): set by object
- mount(target): mount to DOM
- unmount(): unmount from DOM
- destroy(): destroy model (removes listeners etc)

Events:
- init: model created
- update: model updating
- updated: model updated
- render: rendering to DOM
- rendered: rendered to DOM
- mount: mounted to DOM
- unmount: unmounted from DOM
- destroy: model destroyed

Inside render:
- this.$el: DOM element
- this.$find(query): Shortcut to this.$el.querySelector(query)
- this.$findAll(query): Shortcut to Array.prototype.slice.call(this.$el.querySelectorAll(query))

Example:

    var model = frzr.model({
        init: function () {
        },
        update: function (data, oldData) {
            this.c = data.a + data.b
        },
        updated: function (data, oldData) {
            console.log(this.a, this.b, this.c)
        },
        template: '<div class="model"></div>',
        render: function (data) {
            this.$el.textContent = data.a + ' + ' + data.b + ' = ' + data.c
        }
    })
    model.reset({
        a: 1,
        b: 2
    })
    model.set({a: 2, d: 3})
    model.unset('d')


## collection(params)

Parameters:

- key: ID key, i.e. "_id"
- index: attributes to index, separated by space, i.e. "parent resolution"
- model: model to use

Example:

    var collection = frzr.collection({
        key: '_id',
        index: 'parent resolution',
        model: model
    })
    collection.reset([
        {_id: 1, title: 'Title 1'},
        {_id: 2, title: 'Title 2', parent: 1},
        {_id: 3, title: 'Title 3', parent: 1}
    ])
    console.log(collection.find('parent', 1))
    console.log(collection.get(2))


Attributes:

- get(): Get all models
- get(id): Get model by id or index (whether key is set or not)
- raw(): Get raw data
- raw(id): Get raw data by id or index
- set(id, data): Set data by id or index
- find(key, value): Find all where data[key] === value (key must be indexed)
- findOne(key, value): Find first one where data[key] === value
- unset(id): Unset by id
- reset(data): Reset data (if key set, inserts/reorders/updates models)
- mount(target): Mount all models to the DOM
- unmount(): Unmount all models from DOM

## Transition(el, time, params)

Parameters:

- from: Style attributes to animate from (if 'auto', value is calculated automatically)
- to: Style attributes to animate to (if 'auto', value is calculated automatically)
- delay: Animation delay
- ease: What easing to use ()
- remove: Attributes to remove after transition is ready (separated by space)
- onComplete: What to do when transition is ready

Example:

    frzr.transition(el, 1.5, {
        from: {
            height: 'auto',
            transform: 'translate(0, 0)'
        },
        to: {
            height: 0,
            transform: 'translate(0, 100)'
        }
    })


Easing functions:

- easeInQuad, easeInCubic, easeInQuart, easeInQuint, easeInSine, easeInExpo, easeInCirc, easeInBack
- easeOutQuad, easeOutCubic, easeOutQuart, easeOutQuint, easeOutSine, easeOutExpo, easeOutCirc, easeOutBack
- easeInOutQuad, easeInOutCubic, easeInOutQuart, easeInOutQuint, easeInOutSine, easeInOutExpo, easeInOutCirc, easeInOutBack
