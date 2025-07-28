// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://metarange.github.io/',
	integrations: [
		starlight({
			title: 'metaRange',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/metaRange/metaRange/' }],
            favicon: '/favicon.ico',
              head: [
                {
                tag: 'link',
                attrs: {
                    rel: 'icon',
                    href: '/logo_abstract.svg',
                    type: 'image/svg+xml',
                },
                },
            ],
            logo: {
                src: './src/assets/logo_small.png',
            },
			sidebar: [
				{
					label: 'Basics',
                    autogenerate: { directory: 'introduction' }
				},
                {
					label: 'Model Templates',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Non-overlapping Generations', slug: 'templates/non-overlapping' },
                        { label: 'Overlapping Generations', slug: 'templates/overlapping' },
                        { label: 'MTE', slug: 'templates/mte' },
                        // { label: 'Competition', slug: 'templates/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
            customCss: [
                // Relative path to your custom CSS file
                './src/styles/hero.css',
                './src/styles/custom.css',
                // './src/styles/drawflow.min.css',
            ],
            components: {
                Footer: './src/components/Footer.astro',
            },
		}),
	],
});
