/**
 * Created by rancongjie on 16/7/8.
 */
(function () {
    /**
     * [UMD description]
     * @param {[type]} name      [description]
     * @param {[type]} component [description]
     */
    var UMD = function (name, component) {
        switch (1) {
            // CommonJS 规范
            case typeof method === 'object' && !!module.exports:
                module.exports = component;
                break;
            // AMD 规范
            // todo webpage 打包存在问题
            case typeof define === 'function' && !!define.amd:
                define(name, function () {
                    return component;
                });
                break;
            default:
                //todo IE6-7
                window[name] = component;

        }
    };
    /**
     * [warning description]
     * @param  {[type]} message [警告信息]
     * @return {[type]}         [description]
     */
    var warning = function (message) {
        window.console && console.warn && console.warn(message);
    };

    var Tree = function (config) {
        if (config) this.config = config;
    };
    //将 api 列表 包装为 一个树形结构
    Tree.listToRawTree = function (list) {
        var rawTree = {};
        var i, j, k, name, methods, path;
        //判读API数组书写是否有误
        for (i = 0; i < list.length; i++) {
            if (!/^(\S+)\s+\/(\S*)$/.test(list[i])) {
                //如 GET /***/***
                throw new Error('此条数据配置有误' + list[i] + '!');
            }
            //第一个实体为方法，第二个实体为路径
            methods = RegExp.$1;
            path = RegExp.$2.split('/');
            for (k = rawTree, j = 0; j < path.length; j++) {
                //将有参数的部分移除，变为子树
                //参数支持写法 {***}、[***]、(***)、<***>、:***
                //此处使用不捕获匹配，提高效率(?:exp)
                name = path[j].replace(/^(?:\{.*\}|\[.*\]|\(.*\)|<.*>|:.*)$/, '#rawSubTree');
                k = k[name] = Object(k[name]);
            }
            //如果方法名为*，则该路径适用于全部方法
            methods = methods.replace(/.*\*.*/, 'GET,POST,PUT,PATCH,DELETE');
            k['#methods'] = (k['#methods'] || []).concat(methods.match(/\w+/g));
        }
        return rawTree;
    };
    //每一哥路径都是一个数组
    Tree.prototype = [];


    Tree.prototype.getPath = function () {
        var that = this;
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result[i] = function callee(what) {
                if (typeof what !== 'function') return what;
                return callee(what());
            }(this[i]);
        }
        if (this.config.promise) {
            return this.config.promise.all(result).then(function (path) {
                return that.wrapHost(path);
            });
        } else {
            return this.wrapHost(result);
        }
    };
    /**
     *
     * @param path
     * @returns {string}
     */
    Tree.prototype.wrapHost = function (path) {
        var host = this.config.host;
        host = host == null ? '/api' : host + '';
        if (host.charAt(host.length - 1) !== '/') host += '/';
        //不是http(s)://  / 开头的 加上/
        host.replace(/^(?!\w+:\/\/)(?!\/)/, '/');
        return host + path.join('/');
    };
    /**
     *
     * @param name
     * @returns {Tree}
     */
    Tree.prototype.createChild = function (name) {
        var Tree = function () {};
        Tree.prototype = this;
        var node = new Tree();
        node.push(name);
        return node;
    };
    /**
     *
     * @param method
     * @returns {Function}
     */
     Tree.prototype.buildMethod = function (method) {
        // debugger;
        var node = this;
        return function (data) {
            var what = node.getPath();
            var launch = function (path) {
                return node.config.http({method: method, path: path, data: data});
            };
            if (typeof what === 'string') {
                return launch(what);
            } else {
                return what.then(launch)
            }
        }
    };
    /**
     *
     * @param rawTree
     * @returns {handler}
     */
    Tree.prototype.loadRawTree = function (rawTree) {
        // debugger;
        // console.log(rawTree);
        var that = this;
        var rawSubTree = rawTree['#rawSubTree'] || {};
        var methods = rawTree['#methods'] || [];
        var handler = function (name) {
            return handler[name] = that.createChild(name).loadRawTree(rawSubTree);
        };
        for (var name in rawTree) {
            if (name.charAt(0) === '#') continue;
            handler[name] = this.createChild(name).loadRawTree(rawTree[name]);
        }
        for (var i = 0; i < methods.length; i++) {
            handler[methods[i].toLowerCase()] = this.buildMethod(methods[i]);
        }
        return handler;
    };
    /**
     *
     * @param list
     * @param config
     * @returns {handler}
     */
    var webRestSDK = function (list, config) {
        config = Object(config);
        config.promise = config.promise || window.Promise;
        if (typeof config.http !== 'function') {
            warning('必须提供HTTP方法,否则请求将不能发送');
            config.http = function (params) {
                return {
                    then: function (callback) {
                        callback(params);
                        return this;
                    }
                }
            }
        }
        if (typeof config.promise !== 'function') {
            warning('强烈建议支持promise服务,否则异步参数将不被支持');
        }
        return new Tree(config).loadRawTree(Tree.listToRawTree(list));
    };
    UMD('webRest', webRestSDK);
})();
