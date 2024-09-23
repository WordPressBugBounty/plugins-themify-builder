const {Row} = await import('./row.mjs');
export class Module extends Row {
    static get_styles() {
        return this.get_base_styles('subrow');
    }
}