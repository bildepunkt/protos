/**
 * Proto
 * Note: all properties should be declared inside methods otherwise complex objects will be transferred by reference
 * Remember: the static fn/constructor cannot be assigned properties, only methods. however you may assign both to it's prototype (which will become the instances)
 */

(function() {

var getUid = function() {
    return new Date().getTime() * (Math.random() + 1);
};

var proto = {};

// _super param should only be used by proto.extend()
proto.create = function(members, _super) {
    var _superName = _super ? '$' + _super.name : undefined;
    var alpha;
    var prop;

    // if no init (constructor) create one
    if (members.init) {
        alpha = function(options) {
            this._uid = getUid();
            this.init(options);
        };
    } else {
        alpha = function() {
            this._uid = getUid();
        };
    }

    if (_super) {
        for (prop in _super) {
            // first set to prototype
            if (typeof _super[prop] === 'function') {
                alpha.prototype[prop] = _super[prop];
            }
        }
    }

    // add in methods and overwrite _supers - it's okay :)
    for (prop in members) {
        if (typeof members[prop] === 'function') {
            alpha.prototype[prop] = members[prop];
        }
    }

    if (_super) {
        // then create "super" object on the prototype and add only the overwritten methods
        alpha.prototype[_superName] = {};
        for (prop in _super) {
                // if is function and has been overwritten
            if (typeof _super[prop] === 'function' && _super[prop] !== alpha.prototype[prop]) {
                alpha.prototype[_superName][prop] = _super[prop];
            }
            // or if is super object of this super object :P
            else if (typeof _super[prop] === 'object' && /\$[a-z0-9]+/i.test(prop)) {
                alpha.prototype[prop] = _super[prop];
            }
        }
    }

    // we add name to proto so we can pass it to _super
    if (!members.name) {
        throw new TypeError('All proto objects need a "name" property for working inheritance');
    }
    alpha.prototype.name = members.name;

    // add static method
    alpha.extend = proto._extend;

    return alpha;
};

proto._extend = function(members) {
    // "this" represents the static function/constructor returned by proto.create()
    return proto.create(members, new this());
};

try {
    module.exports = proto;
} catch(e) {
    try {
        define([], proto);
    } catch(e) {
        window.proto = proto;
    }
}

}());
