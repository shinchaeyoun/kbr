//kbc.player.control_use//////////////////////////////////////////////////////////////////////////////////
;(function(root, name, factory){
	if(root[name]){
		root[name].addModule("control_use", factory(root[name]));
	}else{
		throw new Error(name+" isn't defined.");
	}
}(window, "KbcPlayer", function(m_exports){
	return (function(modules){
		var exports = {};
		modules.forEach(function(m){
			var module = {name:"", exports:{}};
			m.call(modules.exports, module, exports, m_exports);
			if(module.name) exports[module.name] = module.exports;
		});

		return exports;
	})([

		(function(module, exports, m_exports){
			function init(){
				this.useControl = true;
				return this;
			};

			module.name = "init";
			module.exports = init;
		}),
		
		(function(module, exports, m_exports){
			var useControl = true;
			var ClassPrototype = {
				useControl:{
					configurable:false,
					set:function(bol){
						useControl = bol;
						var conwrap = this.wrap.control.querySelectorAll(".controlset");
						conwrap.forEach(function(v){
							if(!(m_exports.IS_MOB && v.id == "volume")){
								;v.style.display = (bol)?"":"none";
							}
								
						})

						var blankwrap = this.wrap.control.querySelectorAll(".blank")
						blankwrap.forEach(function(v){
							;v.style.display = (bol)?"none":"";
						})
					},
					get:function(){
						return useControl;
					}
				}
			};

			module.name = "ClassPrototype";
			module.exports = ClassPrototype;
		})		
	]);
}));