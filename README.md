Protos
=====
Protos is a library for creating inheritable js objects.

### Features
* infinite sub classing
* super class methods (without use of deprecated arguments.caller/callee)
* overwrite members in constructor argument
* auto called 'init' method

### In depth
Protos uses the object's "protosName" property - required for every Protos object - to keep track of super class methods that can be called from the sub class. Because any overwritten super methods are stored in the sub class's prototype, classes can be infinitly inherited with no scope loss or need for a super class's presence.

```
var Foo = Protos.extend({
    // required property
    protosName: 'foo',

    init: function() {
        console.log('foo here!');
    }
});

var Bar = Foo.extend({
    protosName: 'bar',

    init: function() {
        // super class object is prefixed with dollar sign
        this.$foo.init.call(this);

        console.log('bar here!');
    }
});

var bar = new Bar();

// outputs:
// -> 'foo here!'
// -> 'bar here!'
```

Any member can be overwritten via constructor argument.
```
var Foo = Protos.extend({
    protosName: 'foo',

    bar: null,
    baz: null,

    init: function() {
        console.log(this.bar, this.baz);
    }
});

var foo = new Foo({
    bar: 'new value: "bar"',
    baz: 'new value: "baz"'
});

// outputs:
// -> new value: "bar" new value: "baz"
```
