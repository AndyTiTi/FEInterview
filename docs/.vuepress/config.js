module.exports = {
	title: 'Hello VuePress',
	description: 'Just playing around',
	themeConfig: {
		displayAllHeaders: true,
		nav: [
			{ text: 'Home', link: '/', icon: 'reco-home' },
			{ text: 'sidebar', link: '/sidebar/' },
			{ text: '前端面试题', link: '/sidebargroup/vue1' },
			{
				text: 'Languages',
				ariaLabel: 'Language Menu',
				items: [
					{ text: 'Chinese', link: '/language/chinese/' },
					{ text: 'Japanese', link: '/language/japanese/' },
				],
			},
			{
				text: 'Type',
				items: [
					{
						text: 'Group1',
						items: [
							{ text: 'Chinese', link: '/language/chinese/' },
							{ text: 'Japanese', link: '/language/japanese/' },
						],
					},
					{
						text: 'Group2',
						items: [
							{ text: 'Chinese', link: '/language/chinese/' },
							{ text: 'Japanese', link: '/language/japanese/' },
						],
					},
				],
			},
		],
		sidebar: {
			'/sidebar/': ['', '/sidebar/bar1', '/sidebar/bar2'],
			'/other/': ['', '/other/installUse', '/other/webpack'],
			'/sidebargroup/': [
				{
					title: 'Vue篇',
					children: ['vue1', 'vue2'],
				},
				{
					title: 'React篇',
					children: ['react1', 'react2'],
				},
				{
					title: 'Webpack篇',
					children: ['bar1', 'bar2', 'bar3'],
				},
				// {
				// 	title: 'Webpack篇',
				// 	sidebarDepth: 2,
				// 	children: [
				// 		{
				// 			title: '第一章',
				// 			children: ['bar1'],
				// 		},
				// 		{
				// 			title: '第二章',
				// 			children: ['bar2'],
				// 		},
				// 		{
				// 			title: '第三章',
				// 			children: ['bar3'],
				// 		},
				// 	],
				// },
			],
		},
		logo: '/head.png',
		authorAvatar: '/head.png',
		// 搜索设置
		search: true,
		searchMaxSuggestions: 10,
		// // 自动形成侧边导航
		// sidebar: 'auto',
		// sidebarDepth: 4,
		// // 最后更新时间
		// lastUpdated: 'Last Updated',
		// // 作者
		// author: 'reco_luan',
		// // 备案号
		// record: 'xxxx',
		// // 项目开始时间
		// startYear: '2017',
		// /**
		//  * 密钥 (if your blog is private)
		//  */
		// friendLink: [
		// 	{
		// 		title: '午后南杂',
		// 		desc: 'Enjoy when you can, and endure when you must.',
		// 		email: '1156743527@qq.com',
		// 		link: 'https://www.recoluan.com',
		// 	},
		// 	{
		// 		title: 'vuepress-theme-reco',
		// 		desc: 'A simple and beautiful vuepress Blog & Doc theme.',
		// 		avatar: 'https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png',
		// 		link: 'https://vuepress-theme-reco.recoluan.com',
		// 	},
		// ],
		/**
		 * support for
		 * '' | 'default'
		 * 'coy'
		 * 'dark'
		 * 'funky'
		 * 'okaidia'
		 * 'solarizedlight'
		 * 'tomorrow'
		 * 'twilight'
		 */
	},
}
