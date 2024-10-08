(($,api,bodyCl,_CLICK_)=> {
    "use strict";
    $.ThemifyGradient = function (element, options) {
        const defaults = {
            gradient: $.ThemifyGradient.default,
            width: 173,
            height: 15,
            point: 8,
            angle: 180,
            circle: false,
            type: 'linear', // [linear / radial]
            onChange() {
            },
            onInit() {
            }
        },
        $element = $(element);
		let $pointsContainer,
        $pointsInfosContent, 
        $pointColor,
        $pointPosition, 
        $btnPointDelete,
        _context, 
        _selPoint,
        points = [];
        this.isInit = false;
        this.initSwatchesFlag = false;
        this.settings = {};
        this.__constructor = function () {
            this.settings = {...defaults, ...options};
            this.update();
            this.settings.onInit();
            this.isInit = true;
            return this;
        };
        this.updateSettings = function (options) {
            this.settings = {...defaults, ...options};
            this.update();
            return this;
        };
        this.update = function () {
            this._setupPoints();
            this._setup();
            this._render();
        };
        this.getCSSvalue = function () {
			const defCss = [],
                defDir = this.settings.type === 'radial'?(this.settings.circle ? 'circle,' : ''):this.settings.angle + 'deg,';
            for (let i = 0; i < points.length; ++i) {
                defCss.push(points[i][1] + ' ' + points[i][0]);
            }
            return this.settings.type + '-gradient(' + defDir + defCss.join(', ') + ')';
        };
        this.getString = function () {
            let out = '';
            for (let i = 0; i < points.length; ++i) {
                out += points[i][0] + ' ' + points[i][1] + '|';
            }
            return out.substr(0, out.length - 1);
        };
        this.setType = function (type) {
            this.settings.type = type;
            this.settings.onChange(this.getString(), this.getCSSvalue());
        };
        this.setAngle = function (angle) {
            this.settings.angle = angle;
            this.settings.onChange(this.getString(), this.getCSSvalue());
        };
        this.setRadialCircle = function (circle) {
            this.settings.circle = circle;
            this.settings.onChange(this.getString(), this.getCSSvalue());
        };
        this._setupPoints = function () {
            points = [];
            if (Array.isArray(this.settings.gradient)) {
                points = this.settings.gradient;
            }
            else {
                points = this._getGradientFromString(this.settings.gradient);
            }
        };
        this._setup = function () {
            const self = this,
            fragment = createDocumentFragment(),
            _container = createElement('',{class: 'themifyGradient tf_rel',tabindex:-1}),
            pointsInfos = createElement('','gradient-pointer-info'),
			tmpDiv1=createElement(),
            oldGradient=element.tfClass('themifyGradient')[0];
			
            $btnPointDelete = createElement('a',{href:'#',class:'gradient-point-delete tf_close'});
            $pointColor = createElement('', 'point-color');
            $pointPosition = createElement('input',{type:'text',class:'point-position'});
            $pointsContainer =  createElement('', 'points');
            $pointsInfosContent = createElement('','content');
            
			
            let _canvas = createElement('canvas',{width:self.settings.width,height:self.settings.height});
			tmpDiv1.style.backgroundColor='#00ff00';
			$pointColor.appendChild(tmpDiv1);
            $pointsInfosContent.append($pointColor,createElement('span','gradient_delimiter'),$pointPosition,createElement('span','gradient_percent','%'),$btnPointDelete);
            pointsInfos.append(createElement('','gradient-pointer-arrow'),$pointsInfosContent);
            fragment.append($pointsContainer,_canvas,pointsInfos);
            
            _container.appendChild(fragment);
            
            if(oldGradient){
                oldGradient.remove();
            }
            element.prepend(_container);
            // Add swatches HTML
            if(!element.tfClass('tb_gradient_swatches')[0]){
                element.appendChild(this.swatchesHTML());
                this.initSwatches();
            }
            
            $pointsInfosContent = $($pointsInfosContent);
            $pointColor = $($pointColor);
            $pointPosition = $($pointPosition);
            $btnPointDelete = $($btnPointDelete);
            $pointsContainer = $($pointsContainer);
            _context = _canvas.getContext('2d');
            
            _canvas = $(_canvas);
            
            _canvas.off('click').on('click', function (e) {
                const offset = $(this).offset();
                let defaultColor = 'rgba(0,0,0, 1)', 
                minDist = 999999999999,
                clickPosition = e.pageX - offset.left;
                clickPosition = Math.round((clickPosition * 100) / self.settings.width);
                for (let i = 0; i < points.length; ++i) {
                    points[i][0] = parseInt(points[i][0]);
                    if ((points[i][0] < clickPosition) && (clickPosition - points[i][0] < minDist)) {
                        minDist = clickPosition - points[i][0];
                        defaultColor = points[i][1];
                    }
                    else if ((points[i][0] > clickPosition) && (points[i][0] - clickPosition < minDist)) {
                        minDist = points[i][0] - clickPosition;
                        defaultColor = points[i][1];
                    }
                }
                points.push([clickPosition + '%', defaultColor]);
                points.sort(self._sortByPosition);
                self._render();
                for (let i = 0; i < points.length; ++i) {
                    if (points[i][0] === clickPosition + '%') {
                        self._selectPoint($pointsContainer.find('.point:eq(' + i + ')')[0]);
                    }
                }
                if (api.isFrontend) {
                    setTimeout(self._colorPickerPosition, 315);
                }

            });
            this.pointEvents();
			
        };
        this.pointEvents = function () {
            const self = this,
            listener =  e=> {
                const _this=e.target;
                if(_this.classList.contains('point-position')){
                        let v = parseInt(_this.value.trim());
                        if (isNaN(v)) {
                                v = 0;
                        }
                        else if (v < 0) {
                                v = Math.abs(v);
                        }
                        else if (v >= 98) {
                                v = 98;
                        }
                        if (e.type !== 'focusout') {
                                v = Math.round((v * this.settings.width) / 100);
                                $(_this).closest('.themifyGradient').find('.themify_current_point').css('left', v);
                                this._renderCanvas();
                        }
                        else {
                                _this.value = v;
                        }
                }
            };
			$pointsInfosContent[0].tfOn('focusout keyup',listener,{passive: false});
			
			$pointsContainer[0].tfOn('keyup',e=>{
                if (e.code === 'Delete' && doc.activeElement.tagName !== 'INPUT') {
                                        $pointPosition.focus();
                    this.removePoint(e);
                }
            },{passive: false})
            .tfOn(_CLICK_,e=>{
				if(e.target.classList.contains('point')){
					this._selectPoint(e.target);
					if (api.isFrontend) {//fix drag/drop window focus
						this._colorPickerPosition();
					}
				}
			},{passive:true})
            .tfOn('pointerdown',function(e){
				if(e.button === 0 && e.target.classList.contains('point')){
					e.stopImmediatePropagation();
					let timer;
					const p=e.target,
					_startDrag=e=>{
						element.focus();	
						p.classList.add('tb_gradient_drag_point');
						bodyCl.add('tb_start_animate','tb_move_drag','tb_gradient_drag');
					},
					max=self.settings.width,
					marginLeft=parseFloat(getComputedStyle(p).getPropertyValue('margin-left')) || 0,
					dragX=p.offsetLeft-e.clientX,
					_move=e=>{
						e.stopImmediatePropagation();
						timer=requestAnimationFrame(()=>{
							let clientX=dragX+e.clientX-marginLeft;
							if(clientX>max){
								clientX=max;  
							}
							else if(clientX<0){
							  clientX=0;
							}
							p.style.left=clientX+'px';
							self._selectPoint(p, true);
							self._renderCanvas();
						});
					},
                    _up=function(e){
                        if(timer){
                            cancelAnimationFrame(timer);
                        }
                        e.stopImmediatePropagation();
                        this.tfOff('pointermove', _startDrag,{passive: true,once:true})
                            .tfOff('pointermove', _move, {passive: true})
                            .tfOff('lostpointercapture pointerup',_up, {passive: true,once:true});
                        bodyCl.remove('tb_start_animate','tb_move_drag','tb_gradient_drag');
                        this.classList.remove('tb_gradient_drag_point');
                        element.focus();
                        timer=null;
                    };
					p.tfOn('lostpointercapture pointerup',_up, {passive: true,once:true})
                    .tfOn('pointermove', _startDrag,{passive: true,once:true})
                    .tfOn('pointermove', _move, {passive: true})
                    .setPointerCapture(e.pointerId);
				}
			},{passive:true});
			
        };
        this._render = function () {
            this._initGradientPoints();
            this._renderCanvas();
        };
        this._colorPickerPosition = function () {
            const lightbox = $(api.LightBox.el),
				p = $pointsInfosContent.find('.tfminicolors'),
				el = p.find('.tfminicolors-panel');
			if(el.length>0){
				if ((lightbox.offset().left + lightbox.width()) <= el.offset().left + el.width()) {
					p.addClass('tb_minicolors_right');
				}
				else {
					p.removeClass('tb_minicolors_right');
				}
			}
        };
        this._initGradientPoints = function () {
            const fragment = createDocumentFragment();
            for (let i = 0, len = points.length; i < len; ++i) {
                let p=createElement('', 'point');
                p.style.backgroundColor = points[i][1];
                p.style.left =  ((parseInt(points[i][0]) * this.settings.width) / 100)+'px';

                fragment.appendChild(p);
            }
			$pointsContainer[0].replaceChildren(fragment);
        };
        this.hexToRgb = function (hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b)=>{
                return r + r + g + g + b + b;
            });

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        this._selectPoint = function (el, is_drag) {
			if(!el){
				return;
			}
            const self = this;
            let left = parseInt(el.style.left);
            $pointPosition.val(Math.round((left / this.settings.width) * 100));
            left -= 30;
            if (left < 0 && bodyCl.contains('tb_module_panel_docked')) {
                left = 3;
            }
			$pointsInfosContent[0].parentNode.style.marginLeft=left + 'px';
            if (is_drag) {
                return false;
            }
            $element.focus();
            _selPoint = $(el);
            _selPoint.addClass('themify_current_point').siblings().removeClass('themify_current_point');
            let bgColor = _selPoint.css('backgroundColor');
                $element.find('.point-color .tfminicolors').remove();

            // create the color picker element
            let $input = $pointColor.find('.themify-color-picker');
            if ($input.length === 0) {
                $input = $('<input type="text" class="themify-color-picker" />');
                $input.appendTo($pointColor).tfminicolors({
                    opacity: true,
                    changeDelay: 10,
                    change(value, opacity) {
                        let rgb = self.hexToRgb(value);
                        if (!rgb) {
                            rgb = {r: 255, g: 255, b: 255};
                            opacity = 1;
                        }
                        _selPoint.css('backgroundColor', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
                        self._renderCanvas();
                    }
                });
                $element.find('.tfminicolors').first().addClass('tfminicolors-focus');
                $btnPointDelete.off('click').on('click', this.removePoint.bind(this));
            }
            let rgb = bgColor.replace(/^rgba?\(|\s+|\)$/g, '').split(','),
                    opacity = rgb.length === 4 ? rgb.pop() : 1; // opacity is the last item in the array
            rgb = this._rgbToHex(rgb);
            // set the color for colorpicker
            $input.val(rgb).attr('data-opacity', opacity).data('opacity', opacity).tfminicolors('settings', {value: rgb});
        };
        this._renderCanvas = function () {
            const items = $pointsContainer[0].tfClass('point');
            points = [];
            for (let i = 0; i < items.length; ++i) {
                let position = Math.round((parseInt(items[i].style.left) / this.settings.width) * 100);
                points.push([position + '%', items[i].style.backgroundColor]);
            }
            points.sort(this._sortByPosition);
            this._renderToCanvas();
            if (this.isInit) {
                this.settings.onChange(this.getString(), this.getCSSvalue());
            }
        };
        this._renderToCanvas = function () {
            const gradient = _context.createLinearGradient(0, 0, this.settings.width, 0);
            for (let i = 0; i < points.length; ++i) {
                gradient.addColorStop(parseInt(points[i][0]) / 100, points[i][1]);
            }
            _context.clearRect(0, 0, this.settings.width, this.settings.height);
            _context.fillStyle = gradient;
            _context.fillRect(0, 0, this.settings.width, this.settings.height);
        };
        this._getGradientFromString = function (gradient) {
            const arr =[],
                    points = gradient.split('|');
            for (let i = 0, len = points.length; i < len; ++i) {
                let position,
                        el = points[i],
                        index = el.indexOf('%'),
                        sub = el.substr(index - 3, index);
                if (sub === '100' || sub === '100%') {
                    position = '100%';
                }
                else if (index > 1) {
                    position = parseInt(el.substr(index - 2, index));
                    position += '%';
                }
                else {
                    position = parseInt(el.substr(index - 1, index));
                    position += '%';
                }
                arr.push([position, el.replace(position, '')]);
            }
            return arr;
        };
        this._rgbToHex = function (rgb) {
            const R = rgb[0], G = rgb[1], B = rgb[2],
            toHex=n=>{
                n = parseInt(n, 10);
                if (isNaN(n)) {
                    return '00';
                }
                n = Math.max(0, Math.min(n, 255));
                return '0123456789ABCDEF'.charAt((n - n % 16) / 16) + '0123456789ABCDEF'.charAt(n % 16);
            };
            return '#' + toHex(R) + toHex(G) + toHex(B);
        };
        this._sortByPosition = function (data_A, data_B) {
            data_A = parseInt(data_A[0]);
            data_B = parseInt(data_B[0]);
            return data_A < data_B ? -1 : (data_A > data_B ? 1 : 0);
        };
        this.removePoint = function(e){
            e.preventDefault();
            if (points.length > 1) {
                points.splice(_selPoint.index(), 1);
				const p=$pointsInfosContent[0].parentNode;
				p.style.display='none';
				setTimeout(()=>{
					p.style.display='';
				},50);
                this._render();
            }
        };
        this.swatchesHTML = function(){
            const fr = createDocumentFragment(),
				dropdownIcon = createElement('',{class:'tf_cm_dropdown_icon',tabindex:-1}),
				swatchesContainer = createElement('ul','tb_gradient_swatches tf_scrollbar tf_w'),
				dropdown = themifyColorManager.makeImportExportDropdown(),
                addBtn = createElement('button',{class: 'tb_gradient_add_swatch tf_plus_icon',type:'button'});
            addBtn.tfOn(_CLICK_,this.saveSwatch.bind(this))
            .appendChild(createElement('span','themify_tooltip',i18n.save_gradient));
            
            dropdown.tfOn(_CLICK_,e=>{
                this.swatchesDropdownClicked(e);
            });
            dropdownIcon.append(createElement('span','themify_tooltip',i18n.ie_gradient),api.Helper.getIcon('ti-import'),dropdown);
            swatchesContainer.tfOn(_CLICK_,e=>{
                this.swatchClicked(e);
            });
			
            fr.append(addBtn,dropdownIcon,swatchesContainer);
            return fr;
        };
        this.swatchesDropdownClicked = function ( e ) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target,
                classList = target.classList;
            if(classList.contains('tb_cm_export')){
                target.parentNode.parentNode.parentNode.blur();
				themifyColorManager.exportColors( 'gradients' );
            }
			else if(classList.contains('tb_cm_import')){
                target.parentNode.parentNode.parentNode.blur();
                themifyColorManager.importColors('gradients');
            }
        };
        this.saveSwatch = function () {
            if('' === this.getString() || '' === this.getCSSvalue())return false;
			
            const swatches = Object.keys(themifyCM.gradients),
                css = this.getCSSvalue();
            for(let i = swatches.length-1; i>-1; --i) {
                if ( themifyCM.gradients[swatches[i]].css === css ){
                    return null;
                }
            }
            const id = themifyColorManager.UID(),
                swatch = {
                    id : id,
                    setting : JSON.parse(JSON.stringify(this.settings)),
                    gradient : this.getString(),
                    css : css,
                    points : points
                };
            themifyCM.gradients[id] = swatch;
            this.addSwatch(swatch);
            themifyColorManager.updateColorSwatches('gradients');
        };
        this.addSwatch = function ( swatch, init ) {
            const sw = createElement('li',{class:'tb_gradient_swatch','data-id':swatch.id});
            sw.style.background = swatch.css;
             
            sw.appendChild(createElement('span','tf_delete_swatch tf_close'));
            if(init){
                const container = element.parentElement.tfClass('tb_gradient_swatches')[0];
                container.insertBefore(sw, container.firstChild);
            }
			else{
                const gradients = api.LightBox.el.tfClass('tb_gradient_swatches');
                for(let i=0; i <gradients.length;++i){
                    gradients[i].insertBefore(sw.cloneNode(true), gradients[i].firstChild);
                }
            }
        };
        this.swatchClicked = function(e){
            e.preventDefault();
            const target = e.target,
                classList = target.classList;
            if(classList.contains('tb_gradient_swatch')){
                this.selectSwatch(target.dataset.id);
            }
            else if(classList.contains('tf_delete_swatch')){
                this.removeSwatch(target.parentNode.dataset.id);
                themifyColorManager.updateColorSwatches('gradients');
            }
        };
        this.removeSwatch = function(id){
            const swatches = api.LightBox.el.querySelectorAll('.tb_gradient_swatch[data-id="'+id+'"]');
            for(let i=swatches.length-1;i>-1; --i){
                swatches[i].remove();
            }
            delete themifyCM.gradients[id];
        };
        this.selectSwatch = function (id) {
            const swatch = themifyCM.gradients[id];
            this.setAngle(swatch.setting.angle);
            this.setRadialCircle(swatch.setting.circle);
            this.setType(swatch.setting.type);
            this.settings.gradient = swatch.gradient;
            this.update();
            const container = element.parentElement,
                type = container.tfClass('themify-gradient-type')[0],
                circle = container.querySelector('input[type="checkbox"]'),
                angle = container.tfClass('tb_angle_input')[0];
            type.value = swatch.setting.type;
            Themify.triggerEvent(type, 'change');
            circle.checked = swatch.setting.circle;
            Themify.triggerEvent(circle, 'change');
            angle.value = swatch.setting.angle;
            Themify.triggerEvent(angle, 'change');
        };
        this.initSwatches = function(){
            const swatches = Object.keys(themifyCM.gradients),
                    len=swatches.length;
            themifyCM.gradients = len>0 ? themifyCM.gradients : {};
            for(let i = 0; i <len ; ++i) {
                this.addSwatch(themifyCM.gradients[swatches[i]],true);
            }
        };
        return this.__constructor();
    };
    $.ThemifyGradient.default = '0% rgba(0,0,0, 1)|100% rgba(255,255,255,1)';
    $.fn.ThemifyGradient = function (options) {
        return this.each(function () {
            if ($(this).data('themifyGradient') === undefined) {
                $(this).data('themifyGradient', new $.ThemifyGradient(this, options));
            }
        });
    };
})(jQuery,tb_app,bodyCl,_CLICK_);
