var fs = require('fs');
var path = require('path');
var EOL = require('os').EOL;
var loaderUtils = require('loader-utils');
var SourceNode = require('source-map').SourceNode;
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var HEADER = '/*** IMPORTS FROM prepost-loader ***/\n';

module.exports = function(content, sourceMap) {
	if(this.cacheable) this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	var target = this.resourcePath;
	var targetDir = path.dirname(target);
	var targetBaseName = path.basename(target);

	var getQueryString = function (key) {
		var ret = query[key];
		if (ret && Array.isArray(ret)) {
			return ret.join(EOL);
		}
		return ret || '';
	};

	var prefix = HEADER + getQueryString('prefix') + EOL;
	var autoRequires = [];
	var postfix = EOL + getQueryString('postfix');

	var exts = query.autoRequireExtensions.map(function (ext) {
		return ext[0] === '.' ? ext : '.' + ext;
	});

	if (exts) {
		if (typeof exts === 'string') exts = exts.split(/\s*,\s*/);
		if (Array.isArray(exts)) {
			exts.forEach(function (ext) {
				var fileName = targetBaseName.replace(/\.\w+$/, ext);
				if (fileName !== targetBaseName && fs.existsSync(path.join(targetDir, fileName))) {
					autoRequires.push('require("' + './' + fileName + '")');
				}
			});

			if (autoRequires.length) {
				prefix += EOL + autoRequires.join(EOL) + EOL;
			}
		}
	}

	if(sourceMap) {
		var currentRequest = loaderUtils.getCurrentRequest(this);
		var node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
		node.prepend(prefix);
		node.add(postfix);
		var result = node.toStringWithSourceMap({
			file: currentRequest
		});
		this.callback(null, result.code, result.map.toJSON());
		return;
	}

	return prefix + content + postfix;
};
