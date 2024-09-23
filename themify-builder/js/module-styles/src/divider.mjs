const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
			this.get_expand('zi', [
					this.get_zindex('', 'custom_parallax_scroll_zindex')
			]),
			this.get_expand('tr', [
				this.get_tab({
					n: [
						this.get_transform()
					],
					h: [
						this.get_transform('', 'tr', 'h')
					]
				})
			])
		];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style()
            }
        };
    }
}