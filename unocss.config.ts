import {
	defineConfig, presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	presetWind,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
// @ts-ignore
import import_node_loaders from '@iconify/utils/lib/loader/node-loaders';


export default defineConfig({
	theme: {
		zIndex: {
			// Default highest z-index
			top: 999,
		},
		colors: {},
	},
	rules: [
		['c_', { content: '"\xA0"' }],
	],
	shortcuts: [
		// hocus:bg-black -> hover:bg-black focus:bg-black
		[/hocus:(.+)/, ([,content]) => {
			return `hover:${content} focus:${content}`;
		}],
		// max-size-40 -> max-h-40 max-w-40
		[/((min|max)-)?size-(.+)/, function([, prefix = '', , value]) {
			if (value?.endsWith('v')) {
				return `${prefix}w-${value}w ${prefix}h-${value}h`;
			}
			return `${prefix}w-${value} ${prefix}h-${value}`;
		}],
		/** grid-cols-3_1 is equal to grid-cols-[3fr_1fr] */
		[/^grid-(cols|rows)-([\d_]{3,})$/, ([, type = '', numbers = '']) => {
			return `grid-${type}-[${numbers.replaceAll('_', 'fr_')}fr]`;
		}],
		/** grid-cols-auto-4 is equal to grid-cols-[auto_auto_auto_auto] */
		[/^grid-(cols|rows)-auto-(\d+)$/, ([, type, value = '0']) => {
			return `grid-${type}-[repeat(${value},auto)]`;
		}],
		/** grid-cols-fit-100 -> grid-template-columns: repeat(auto-fit, minmax(400, 1fr)); */
		[/^grid-(cols|rows)-fit-(\S+)$/, ([, type, value]) => {
			return `grid-${type}-[repeat(auto-fit,minmax(${value},1fr))]`;
		}],
	],
	presets: [
		presetWind(),
		presetUno(),
		presetTypography(),
		presetWebFonts({
			fonts: {
				sans: 'Manrope:400,500',
			},
		}),
		presetIcons({
			extraProperties: {
				display:       'inline-block',
				height:        'auto',
				'min-height':  '1em',
				'white-space': 'nowrap',
			},
			collections: {
				// All icons placed inside src/assets/icons will be listed as i-my-${file-name}
				my: import_node_loaders.FileSystemIconLoader(
					'./src/assets/icons',
					(svg: string) => svg.replace(/(#000|#000000|black)/g, 'currentColor'),
				),
			},
		}),
	],
	transformers: [
		transformerDirectives(),
		transformerVariantGroup(),
		transformerCompileClass(),
	],
});
