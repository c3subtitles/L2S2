// http://stackoverflow.com/a/14810714/1659732
Object.defineProperty(Object.prototype, 'map', {
	value: function(f, ctx) {
		ctx = ctx || this;
		var 
			self = this,
			result = {};
		Object.keys(self).forEach(function(v) {
			result[v] = f.call(ctx, self[v], v, self); 
		});
		return result;
	}
});
