//导入生成侧边栏的工具类
const path = require('path')
const rootPath = path.dirname(__dirname)
const { sideBarTool } = require(path.join(__dirname, './utils/index.js'))

// 需要排除的一些目录
let unDirIncludes = ['node_modules', 'assets', 'public', 'dist']
// 只需要处理后缀的文件类型
let SuffixIncludes = ['md', 'html']
//使用方法生生成侧边栏
// 侧边栏
let sidebar = sideBarTool.genSideBarGroup(
	rootPath,
	unDirIncludes,
	SuffixIncludes,
	{}
)
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
		// sidebar,
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
					title: 'TypeScript篇',
					children: ['typescript1', 'typescript2'],
				},
				{
					title: 'Webpack篇',
					children: ['webpack1', 'webpack2', 'webpack3'],
				},
				{
					title: '浏览器篇',
					children: ['browser'],
				},
				{
					title: '服务器篇',
					children: ['server1', 'server2'],
				},
				// {
				// 	title: 'Webpack篇',
				// 	sidebarDepth: 2,
				// 	children: [
				// 		{
				// 			title: '第一章',
				// 			children: ['webpack1'],
				// 		},
				// 		{
				// 			title: '第二章',
				// 			children: ['webpack2'],
				// 		},
				// 		{
				// 			title: '第三章',
				// 			children: ['webpack3'],
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
	configureWebpack: {
		resolve: {
			alias: {
				'@alias': './images',
			},
		},
	},
}
